from django.urls import path
from esig_app import views

urlpatterns = [
    path('api/cours/', views.CoursList.as_view()),
    path('api/publications/', views.PublicationsList.as_view()),
    path('api/horaires/', views.HorairesList.as_view()),
    path('api/notes/', views.NotesList.as_view()),
    path('api/semestres/', views.SemestreList.as_view()),
    path('checks_if_user_exists/', views.check_new_user),
    path('try_login/', views.try_login),
    #path('checks_session/', views.checks_session),
    path('ajouter_cours/<id_cours>/', views.ajouter_cours),
    path('delete_cours/<id_cours>/', views.delete_cours),
    path('ajouter_publi/', views.ajouter_publi),
    path('delete_publi/<id_publi>/', views.delete_publi),
    path('edit/horaire/', views.edit_horaire),
    path('change_bulletin/', views.change_bulletin),
    path('save_semestre/', views.save_semestre),
    path('change_latest/', views.change_latest),
]
