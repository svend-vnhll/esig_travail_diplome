from django.test import TestCase
from django.urls import resolve
from esig_app import views

MAIN_PAGE_PATH = '/main_page/'


# Create your tests here.
class URLTests(TestCase):
    def test_if_status_is_ok(self):
        response = self.client.get(MAIN_PAGE_PATH)
        self.assertEquals(response.status_code, 200)

    def test_if_main_page_calls_main_page_view(self):
        found = resolve(MAIN_PAGE_PATH)
        self.assertEquals(found.func, views.main_page)

