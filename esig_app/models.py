from django.db import models


# Create your models here.
class Utilisateur(models.Model):
    nom = models.CharField(max_length=32, null=False)
    prenom = models.CharField(max_length=64, null=False)
    email = models.CharField(max_length=32, null=False)
    groupe = models.CharField(max_length=16, null=False)
    role = models.CharField(max_length=16, null=False)
    mdp = models.CharField(max_length=600, null=False)


class Cours(models.Model):
    code = models.CharField(max_length=5, null=False)
    nom = models.CharField(max_length=64, null=False)
    module = models.CharField(max_length=64, null=False)
    semestre = models.CharField(max_length=1, null=False)
    coefficient = models.DecimalField(decimal_places=0, max_digits=1, null=False)
    is_actif = models.BooleanField(null=False)


class Publication(models.Model):
    titre = models.CharField(max_length=32, null=False)
    tag = models.CharField(max_length=32, null=False)
    contenu = models.CharField(max_length=600, null=False)
    auteur = models.CharField(max_length=32, null=False)
    date = models.DateField(null=False)


# class Bulletin(models.Model):
#     statut = models.CharField(max_length=32, null=False)
#     semestre = models.CharField(max_length=16, null=False)
#     vollee = models.CharField(max_length=16, null=False)
#
#     utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, null=False)
#
#
# class Memo(models.Model):
#     titre = models.CharField(max_length=32, null=False)
#     details = models.CharField(max_length=600, null=True)
#     type = models.CharField(max_length=32, null=False)
#
#     utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, null=False)


class Semestre(models.Model):
    numSemestre = models.CharField(max_length=1,null=False)
    dateDebut = models.CharField(max_length=8, null=False)
    dateFin = models.CharField(max_length=8, null=False)
    latest = models.BooleanField(null=False)

    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, null=False)


class Absence(models.Model):
    date = models.CharField(max_length=8, null=False)
    horaire = models.CharField(max_length=3, null=False)
    semaine = models.CharField(max_length=2, null=False)

    semestre = models.ForeignKey(Semestre, on_delete=models.CASCADE, null=False)
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, null=False)


class CoursEleve(models.Model):
    codeHoraire = models.CharField(max_length=32, null=False)
    codeCours = models.CharField(max_length=32, null=False)
    semestre = models.CharField(max_length=1,null=False)
    salle = models.CharField(max_length=3, null=True)

    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, null=False)
    cours = models.ForeignKey(Cours, on_delete=models.SET_NULL, null=True)


class Note(models.Model):
    resultat = models.CharField(max_length=3, null=False)
    coefficient = models.DecimalField(decimal_places=0, max_digits=1, null=False)
    epreuves = models.DecimalField(decimal_places=0, max_digits=1, null=False)
    codeCours = models.CharField(max_length=32, null=False)

    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, null=False)
    cours = models.ForeignKey(Cours, on_delete=models.SET_NULL, null=True)




