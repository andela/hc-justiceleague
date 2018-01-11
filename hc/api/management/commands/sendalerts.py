import logging
import time

from concurrent.futures import ThreadPoolExecutor
from django.core.management.base import BaseCommand
from django.db import connection
from django.utils import timezone
from hc.api.models import Check

executor = ThreadPoolExecutor(max_workers=10)
logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Sends UP/DOWN email alerts'

    def handle_many(self):
        """ Send alerts for many checks simultaneously. """

        now = timezone.now()
        query = Check.objects.filter(user__isnull=False).select_related("user")
        nags  = query.filter(status="down", nag_after__lt=now)
        going_down = query.filter(alert_after__lt=now, status="up")
        checks = list(going_down.iterator()) + list(nags.iterator())

        if not nags:
            going_up = query.filter(alert_after__gt=now, status="down")
            checks += list(going_up.iterator())

        # Don't combine this in one query so Postgres can query using index:
        if not checks:
            return False

        futures = [executor.submit(self.handle_one, check) for check in checks]
        for future in futures:
            future.result()

        return True

    def handle_one(self, check):
        """ Send an alert for a single check.

        Return True if an appropriate check was selected and processed.
        Return False if no checks need to be processed.

        """

        # Save the new status. If sendalerts crashes,
        # it won't process this check again.


        now = timezone.now()

        tmpl = "\nSending alert, status=%s, code=%s\n"
        self.stdout.write(tmpl % (check.status, check.code))
        self.stdout.write(
            "alert_after: {} nag_after: {} nag: {} last_nag_alert: {}".format(
                check.alert_after, check.nag_after, check.nag,
                check.last_nag_alert
            ))
        errors = check.send_alert()
        for ch, error in errors:
            self.stdout.write("ERROR: %s %s %s\n" % (ch.kind, ch.value, error))

        if check.status == "down":
            check.update_nag()
        check.status = check.get_status()
        check.save()

        connection.close()
        return True

    def handle(self, *args, **options):
        self.stdout.write("sendalerts is now running")

        ticks = 0
        while True:
            if self.handle_many():
                ticks = 1
            else:
                ticks += 1

            time.sleep(1)
            if ticks % 60 == 0:
                formatted = timezone.now().isoformat()
                self.stdout.write("-- MARK %s --" % formatted)
