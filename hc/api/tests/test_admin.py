from hc.api.models import Channel, Check
from hc.test import BaseTestCase

from django.contrib.auth.models import User


class ApiAdminTestCase(BaseTestCase):

    def setUp(self):
        super(ApiAdminTestCase, self).setUp()
        self.check = Check.objects.create(user=self.alice, tags="foo bar")

        # Ensure that alice wasn't already superuser
        self.assertFalse(self.alice.is_superuser)
        self.assertFalse(self.alice.is_staff)

        self.alice.is_staff     = True
        self.alice.is_superuser = True
        self.alice.save()
        retrieved_alice         = User.objects.get(username='alice')

        self.assertTrue(retrieved_alice.is_superuser)
        self.assertTrue(retrieved_alice.is_staff)

    def test_it_shows_channel_list_with_pushbullet(self):
        self.client.login(username="alice@example.org", password="password")

        ch = Channel(user=self.alice, kind="pushbullet", value="test-token")
        ch.save()

        saved_channel = Channel.objects.get(kind="pushbullet")
        self.assertIsNot(saved_channel, None)
        self.assertEqual(saved_channel.kind, "pushbullet")
        res = self.client.get("/admin/api/channel/")

        self.assertContains(res, "Pushbullet")
