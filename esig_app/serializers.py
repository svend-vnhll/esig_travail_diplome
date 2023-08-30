from rest_framework import serializers
from .models import *


class CoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cours
        fields = ('id', 'nom', 'code', 'module', 'semestre', 'coefficient')


class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ('id', 'titre', 'tag', 'contenu', 'auteur', 'date')


class HorairesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoursEleve
        fields = ('id', 'codeCours', 'codeHoraire', 'salle', 'utilisateur', 'cours')


class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'resultat', 'coefficient', 'epreuves', 'codeCours', 'utilisateur', 'cours')


class SemestreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semestre
        fields = ('id', 'numSemestre', 'dateDebut', 'dateFin')


class AbsenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Absence
        fields = ('id', 'dateAbs', 'horaire', 'jour', 'semaine', 'type', 'semestre', 'utilisateur')

