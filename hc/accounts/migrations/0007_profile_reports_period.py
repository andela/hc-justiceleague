
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_profile_current_team'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='reports_period',
            field=models.IntegerField(default=30),
        ),
    ]
