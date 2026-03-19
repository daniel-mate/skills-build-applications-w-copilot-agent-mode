from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from django.utils import timezone

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Users
        tony = User.objects.create(email='tony@stark.com', name='Tony Stark', team='Marvel')
        steve = User.objects.create(email='steve@rogers.com', name='Steve Rogers', team='Marvel')
        bruce = User.objects.create(email='bruce@wayne.com', name='Bruce Wayne', team='DC')
        clark = User.objects.create(email='clark@kent.com', name='Clark Kent', team='DC')

        # Activities
        Activity.objects.create(user=tony.email, type='Running', duration=30, date=timezone.now())
        Activity.objects.create(user=steve.email, type='Cycling', duration=45, date=timezone.now())
        Activity.objects.create(user=bruce.email, type='Swimming', duration=60, date=timezone.now())
        Activity.objects.create(user=clark.email, type='Yoga', duration=20, date=timezone.now())

        # Leaderboard
        Leaderboard.objects.create(team='Marvel', points=75)
        Leaderboard.objects.create(team='DC', points=80)

        # Workouts
        Workout.objects.create(name='Super Strength', description='Strength workout for heroes', difficulty='Hard')
        Workout.objects.create(name='Flight Training', description='Aerobic workout for flying heroes', difficulty='Medium')

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
