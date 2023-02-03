from django.urls import path
from esig_app import views

urlpatterns = [
    path('', views.main_page),
    path('main_page/', views.main_page, name='main_page'),
]
