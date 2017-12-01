import json

from django.test.utils import override_settings

from hc.api.models import Channel, Check
from hc.test import BaseTestCase


@override_settings(PUSHOVER_API_TOKEN="token", PUSHOVER_SUBSCRIPTION_URL="url")
class AddChannelTestCase(BaseTestCase):

    def test_it_adds_email(self):
        url = "/integrations/add/"
        form = {"kind": "email", "value": "alice@example.org"}

        self.client.login(username="alice@example.org", password="password")
        r = self.client.post(url, form)

        self.assertRedirects(r, "/integrations/")
        assert Channel.objects.count() == 1

    def test_it_trims_whitespace(self):
        """ Leading and trailing whitespace should get trimmed. """

        url = "/integrations/add/"
        form = {"kind": "email", "value": "   alice@example.org   "}

        self.client.login(username="alice@example.org", password="password")
        self.client.post(url, form)

        q = Channel.objects.filter(value="alice@example.org")
        self.assertEqual(q.count(), 1)

    def test_instructions_work(self):
        self.client.login(username="alice@example.org", password="password")
        kinds = ("email", "webhook", "pd", "pushover", "hipchat", "victorops")
        for frag in kinds:
            url = "/integrations/add_%s/" % frag
            r = self.client.get(url)
            self.assertContains(r, "Integration Settings", status_code=200)

    ### Test that the team access works
    def test_team_access(self):
        # Create a check
        url = "/checks/add/"
        self.client.login(username="alice@example.org", password="password")
        r = self.client.post(url)
        self.assertRedirects(r, "/checks/")
        check = Check.objects.filter(user=self.alice).first().code
        assert Check.objects.count() == 1
        self.client.logout()
        self.client.login(username="bob@example.org", password="password")
        response = self.client.get('/checks/')
        self.assertIn(str(check), str(response.content))
        self.client.logout()
        self.client.login(username="charlie@example.org", password="password")
        charlie_s_checks = self.client.get('/checks/')
        self.assertContains(charlie_s_checks, "You don\'t have any checks yet.")

    ### Test that bad kinds don't work
    def test_bad_kinds_dont_work(self):
        self.client.login(username="alice@example.org", password="password")
        kinds = ("Mobile", "Etoro", "pdf", "", "snapchat", "Twitter")
        for frag in kinds:
            url = "/integrations/add_%s/" % frag
            r = self.client.get(url)
            self.assertEqual(r.status_code,404)#because these kinds are not found returns 404 

