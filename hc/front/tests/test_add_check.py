from hc.api.models import Check
from hc.test import BaseTestCase


class AddCheckTestCase(BaseTestCase):

    def test_it_works(self):
        url = "/checks/add/"
        self.client.login(username="alice@example.org", password="password")
        r = self.client.post(url)
        self.assertRedirects(r, "/checks/")
        assert Check.objects.count() == 1

    ### Test that team access works
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