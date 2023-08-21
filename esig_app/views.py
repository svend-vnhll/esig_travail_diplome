import decimal
import json
import re
from datetime import date
from django.contrib.auth.hashers import make_password, check_password

from django.http import JsonResponse, HttpResponse
from rest_framework import generics
from decimal import Decimal

from .models import *
from .serializers import CoursSerializer, PublicationSerializer, HorairesSerializer, NotesSerializer, SemestreSerializer


class CoursList(generics.ListAPIView):
    serializer_class = CoursSerializer

    def get_queryset(self):
        search_param = self.request.GET.get('search')
        if str(search_param) == '0':
            queryset = Cours.objects.filter(is_actif=True).order_by("code")
        elif str(search_param) == '1':
            queryset = Cours.objects.filter(is_actif=True, semestre__exact=int(search_param)).order_by("code")
        elif str(search_param) == '2':
            queryset = Cours.objects.filter(is_actif=True, semestre__exact=int(search_param)).order_by("code")
        elif str(search_param) == '3':
            queryset = Cours.objects.filter(is_actif=True, semestre__exact=int(search_param)).order_by("code")
        else:
            queryset = Cours.objects.filter(is_actif=True, semestre__exact=int(search_param)).order_by("code")
        return queryset


class PublicationsList(generics.ListAPIView):
    serializer_class = PublicationSerializer

    def get_queryset(self):
        search_param = self.request.GET.get('search')
        if search_param.lower() == 'annonces':
            queryset = Publication.objects.filter(tag='Annonce').order_by('-date')
        elif search_param.lower() == 'absences':
            queryset = Publication.objects.filter(tag='Absence').order_by('-date')
        elif search_param.lower() == 'evenements':
            queryset = Publication.objects.filter(tag='Evenement').order_by('-date')
        else:
            queryset = Publication.objects.all().order_by('-date')
        return queryset


class NotesList(generics.ListAPIView):
    serializer_class = NotesSerializer

    def get_queryset(self):
        semestre = self.request.GET.get('search')
        user_param = self.request.GET.get('user')
        queryset = Note.objects.filter(cours__semestre__exact=semestre, utilisateur__email__exact=user_param)
        return queryset


class HorairesList(generics.ListAPIView):
    serializer_class = HorairesSerializer

    def get_queryset(self):
        semestre = self.request.GET.get('search')
        user_param = self.request.GET.get('user')
        queryset = CoursEleve.objects.filter(cours__semestre__exact=semestre, utilisateur__email__exact=user_param)
        return queryset


class SemestreList(generics.ListAPIView):
    serializer_class = SemestreSerializer

    def get_queryset(self):
        email = self.request.GET.get('user')
        queryset = Semestre.objects.filter(utilisateur__email__exact=email)
        return queryset


def check_new_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = str(data.get('password'))
        if Utilisateur.objects.filter(email=email).exists() or not check_if_mail_is_valid(email):
            return JsonResponse({'response': "wrong_email"})
        elif len(password) < 8:
            return JsonResponse({'response': "invalid_password"})
        else:
            u = Utilisateur()
            u.email = email.lower()
            u.prenom = (email.split('.')[0]).title()
            u.nom = ((email.split('.')[1]).split('@')[0]).upper()
            u.role = "ELV"
            u.groupe = "Non défini"
            u.mdp = make_password(password)
            u.save()
            return JsonResponse({'response': "all_ok"})
    return JsonResponse({'error': 'Invalid method'})


def check_if_mail_is_valid(mail):
    if re.match(r".*\..*@eduge\.ch", mail):
        return True
    else:
        return False


def try_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        mdp = str(data.get('password'))

        if not Utilisateur.objects.filter(email=email).exists() or not check_if_mail_is_valid(email):
            return JsonResponse({'response': "invalid_email"})
        else:
            u = Utilisateur.objects.get(email__exact=email)
            if check_password(mdp, u.mdp):
                if u.role == "ADM":
                    return JsonResponse({'response': "all_ok", 'isAdmin': True, 'email': u.email})
                else:
                    return JsonResponse({'response': "all_ok", 'isAdmin': False, 'email': u.email})
            else:
                return JsonResponse({'response': "wrong_password"})
    return JsonResponse({'error': 'Invalid method'})


# def checks_session(request):
#     if request.method == 'GET':
#         if request.session.get('admin', False):
#             if request.session.get('admin'):
#                 return JsonResponse({'isValidSession': True})
#         return JsonResponse({'isValidSession': False})
#     return JsonResponse({'error': 'Invalid method'})


def ajouter_cours(request, id_cours):
    if request.method == 'POST':
        data = json.loads(request.body)
        cou_nom = data.get('cou_nom').title()
        cou_code = data.get('cou_code').upper()
        cou_module = data.get('cou_module').title()
        cou_semestre = int(data.get('cou_semestre'))
        cou_coefficient = int(data.get('cou_coefficient'))

        if Cours.objects.filter(code__exact=cou_code, module__exact=cou_module, semestre__exact=cou_semestre, coefficient__exact=cou_coefficient).exists():
            c = Cours.objects.get(code__exact=cou_code, module__exact=cou_module, semestre__exact=cou_semestre, coefficient__exact=cou_coefficient)
            if not c.is_actif:
                c.is_actif = True
                c.save()
                return JsonResponse({'response': "all_ok"})
            else:
                return JsonResponse({'response': "already_exists"})
        elif cou_nom == "" or cou_code == "" or cou_module == "" or cou_semestre < 1 or cou_semestre > 4:
            return JsonResponse({'response': "invalid_input"})
        else:
            if id_cours == '0':
                c = Cours()
            else:
                c = Cours.objects.get(id=int(id_cours))

            if c.pk and c.code != cou_code:
                cours_eleves = CoursEleve.objects.filter(codeCours=c.code)
                for cours_eleve in cours_eleves:
                    cours_eleve.codeCours = cou_code
                    cours_eleve.save()

            c.nom = cou_nom
            c.code = cou_code
            c.module = cou_module
            c.semestre = cou_semestre
            c.coefficient = cou_coefficient
            c.is_actif = True
            c.save()
            return JsonResponse({'response': "all_ok"})
    return JsonResponse({'error': 'Invalid method'})


def delete_cours(request, id_cours):
    if Cours.objects.filter(id=id_cours).exists():
        c = Cours.objects.get(id=id_cours)
        c.is_actif = False
        c.save()
    return HttpResponse()


def ajouter_publi(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        titre_publi = data.get('titre_publi').title()
        type_publi = data.get('type_publi').title()
        contenu_publi = data.get('contenu_publi')
        auteur_publi = data.get('auteur_publi')

        if titre_publi == "" or contenu_publi == "":
            return JsonResponse({'response': "invalid_input"})
        else:
            p = Publication()
            p.titre = titre_publi
            p.tag = type_publi
            p.contenu = contenu_publi
            p.date = date.today().strftime("%Y-%m-%d")
            u = Utilisateur.objects.get(email__exact=auteur_publi)
            p.auteur = u.prenom + " " + u.nom
            p.save()
            return JsonResponse({'response': "all_ok"})
    return JsonResponse({'error': 'Invalid method'})


def delete_publi(request, id_publi):
    if Publication.objects.filter(id=id_publi).exists():
        p = Publication.objects.get(id=id_publi)
        p.delete()
    return HttpResponse()


def edit_horaire(request):
    if request.method == "GET":
        param_horaire = request.GET.get('horaire')
        param_cours = request.GET.get('cours')
        param_semestre = request.GET.get('semestre')
        param_eleve = request.GET.get('eleve')
        param_salle = request.GET.get('salle')

        if param_salle != "0":
            ce = CoursEleve.objects.get(cours__semestre__exact=param_semestre, codeHoraire__exact=param_horaire, utilisateur__email__exact=param_eleve)
            ce.salle = param_salle
            ce.save()
        else:
            if param_cours == "":
                ce = CoursEleve.objects.get(cours__semestre__exact=param_semestre, codeHoraire__exact=param_horaire, utilisateur__email__exact=param_eleve)
                ce.delete()
            else:
                c = Cours.objects.get(code__exact=param_cours)

                if CoursEleve.objects.filter(cours__semestre__exact=param_semestre, codeHoraire__exact=param_horaire, utilisateur__email__exact=param_eleve).exists():
                    ce = CoursEleve.objects.get(cours__semestre__exact=param_semestre, codeHoraire__exact=param_horaire, utilisateur__email__exact=param_eleve)
                    ce.cours = c
                    ce.codeCours = c.code
                    ce.save()
                else:
                    ce = CoursEleve()
                    ce.cours = c
                    ce.codeCours = c.code
                    ce.codeHoraire = param_horaire
                    ce.semestre = param_semestre
                    ce.utilisateur = Utilisateur.objects.get(email__exact=param_eleve)
                    ce.save()
    return HttpResponse()



def change_bulletin(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        notes = data.get('notes')
        eleve = Utilisateur.objects.get(email__exact=data.get('eleve'))

        for key, value in notes.items():
            cours = key[:4]
            er = int(re.search(r'ER(\d)', key).group(1))  # Extraction du numéro ER
            type_value = key[-4:]

            if not Note.objects.filter(epreuves__exact=er, utilisateur__email__exact=eleve.email, cours__code=cours).exists():
                note = Note()
                if type_value == "note":
                    note.resultat = value
                    note.coefficient = 1
                elif type_value == "coef":
                    note.resultat = "4"
                    note.coefficient = int(value)
                note.epreuves = er
                note.utilisateur = eleve
                note.cours = Cours.objects.get(code__exact=cours)
                note.codeCours = note.cours.code
                note.save()
            else:
                note = Note.objects.get(epreuves__exact=er, utilisateur__email__exact=eleve.email, cours__code=cours)
                if type_value == "coef":
                    try:
                        coefficient = int(value)
                        if coefficient < 1 or coefficient > 6:
                            note.coefficient = 1
                        else:
                            note.coefficient = coefficient
                    except ValueError:
                        note.coefficient = 1
                elif type_value == "note":
                    try:
                        resultat = Decimal(value)
                        if resultat < 1 or resultat > 6:
                            note.resultat = Decimal("4")
                        else:
                            note.resultat = resultat
                    except decimal.InvalidOperation:
                        note.resultat = Decimal("4")
                note.save()
    return HttpResponse()


def save_semestre(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        semestre = data.get('semestre')
        eleve = Utilisateur.objects.get(email__exact=data.get('eleve'))
        date_deb = data.get('date_deb')
        date_fin = data.get('date_fin')

        if Semestre.objects.filter(utilisateur__email__exact=eleve.email, numSemestre__exact=semestre).exists():
            s = Semestre.objects.get(utilisateur__email__exact=eleve.email, numSemestre__exact=semestre)
        else:
            s = Semestre()
        s.utilisateur = eleve
        s.numSemestre = semestre
        s.dateDebut = date_deb
        s.dateFin = date_fin
        s.latest = False
        s.save()
    return HttpResponse()


def change_latest(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        semestre = data.get('semestre')
        eleve = Utilisateur.objects.get(email__exact=data.get('eleve'))
        all_semestre = Semestre.objects.filter(utilisateur__email__exact=eleve.email)
        for s in all_semestre:
            if s.numSemestre == semestre:
                s.latest = True
                s.save()
            else:
                s.latest = False
                s.save()
    return HttpResponse()