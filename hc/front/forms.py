from django import forms
from hc.api.models import Channel


class NameTagsForm(forms.Form):
    name = forms.CharField(max_length=100, required=False)
    tags = forms.CharField(max_length=500, required=False)

    def clean_tags(self):
        l = []

        for part in self.cleaned_data["tags"].split(" "):
            part = part.strip()
            if part != "":
                l.append(part)

        return " ".join(l)


class TimeoutForm(forms.Form):
    timeout = forms.IntegerField(min_value=60, max_value=5184000)
    grace = forms.IntegerField(min_value=60, max_value=5184000)

class PriorityForm(forms.Form):
    team            = forms.CharField(max_length=500, required=False)
    priority_select = forms.IntegerField(min_value=-2, max_value=2)

    def clean_team(self):
        team_emails = []

        for email in self.cleaned_data["team"].split(" "):
            email = email.strip()
            if email != "":
                team_emails.append(email)

        return " ".join(team_emails)

class AdvancedTimeoutForm(forms.Form):
    advanced_period = forms.IntegerField(min_value=60, max_value=5184000)
    advanced_grace = forms.IntegerField(min_value=60, max_value=5184000)


class NagPeriodForm(forms.Form):
    nag_period   = forms.IntegerField(min_value=60, max_value=7776000)


class AddChannelForm(forms.ModelForm):

    class Meta:
        model = Channel
        fields = ['kind', 'value']

    def clean_value(self):
        value = self.cleaned_data["value"]
        return value.strip()


class AddWebhookForm(forms.Form):
    error_css_class = "has-error"

    value_down = forms.URLField(max_length=1000, required=False)
    value_up = forms.URLField(max_length=1000, required=False)

    def get_value(self):
        return "{value_down}\n{value_up}".format(**self.cleaned_data)
