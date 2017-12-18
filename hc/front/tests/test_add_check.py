from hc.api.models import Check, Channel
from hc.test import BaseTestCase


class AddCheckTestCase(BaseTestCase):

    def test_it_works(self):
        url = "/checks/add/"
        self.client.login(username="alice@example.org", password="password")
        r = self.client.post(url)
        self.assertRedirects(r, "/checks/")
        assert Check.objects.count() == 1

    ### Test that team access works on channel
    def test_channel_access(self):
        # Create an integration with Alice 
        url = "/integrations/add/"
        form = {"kind": "email", "value": "alice@example.org"}
        self.client.login(username="alice@example.org", password="password")
        r = self.client.post(url, form)
        self.assertRedirects(r, "/integrations/")
        channel = Channel.objects.filter(user=self.alice).first().code
        assert Channel.objects.count() == 1
        self.client.logout()
        """login Bob who has access to  Alice`s integrations therefore the 
        channel created by alice should be viewed by Bob """
        self.client.login(username="bob@example.org", password="password")
        response = self.client.get('/integrations/')
        self.assertIn(str(channel), str(response.content))
        self.client.logout()
        #login with Charlie who has no access to Alice`s integrations
        self.client.login(username="charlie@example.org", password="password")
        charlie_s_channels = self.client.get('/integrations/')
        self.assertNotIn(str("Assigned Checks"), str(charlie_s_channels))