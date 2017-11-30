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
        # Create a check with Alice 
        url = "/checks/add/"
        self.client.login(username="alice@example.org", password="password")
        r = self.client.post(url)
        self.assertRedirects(r, "/checks/")
        check = Check.objects.filter(user=self.alice).first().code
        assert Check.objects.count() == 1
        self.client.logout()
        """login Bob who has access to  Alice`s stuff there fore the 
        check created by alice should be viewed by Bob """
        self.client.login(username="bob@example.org", password="password")
        response = self.client.get('/checks/')
        self.assertIn(str(check), str(response.content))
        self.client.logout()
        #login with Charlie who has no access to Alice`s stuff
        self.client.login(username="charlie@example.org", password="password")
        charlie_s_checks = self.client.get('/checks/')
        self.assertContains(charlie_s_checks, "You don\'t have any checks yet.")