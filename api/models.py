from django.db import models

# Create your models here.
class Portfolio(models.Model):
    ticker = models.CharField(max_length=10, null=False, default=False)
    cost = models.FloatField(null=False, default=False)
    shares = models.FloatField(null=False, default=False)