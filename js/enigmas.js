/* ===== DONNÉES DES ÉNIGMES ===== */
const ENIGMAS = [
  {
    id: 1,
    titre: "L'Avertissement Oublié",
    notion: "Licenciement pour motif personnel",
    icon: "⚠️",
    points: 150,
    document: `
      <div class="doc-error">LETTRE DE LICENCIEMENT — À CORRIGER</div><br>
      <strong>Objet :</strong> Notification de licenciement<br><br>
      Monsieur Martin,<br><br>
      Nous vous informons de votre licenciement <span class="doc-highlight">pour faute grave</span>.<br><br>
      Lors de notre réunion du <span class="doc-error">lundi 15 avril</span>, nous avons évoqué<br>
      vos <span class="doc-error">4 retards consécutifs</span> sans justification.<br><br>
      Votre licenciement est <span class="doc-error">effectif immédiatement</span>, sans préavis<br>
      ni indemnités, conformément à la réglementation.<br><br>
      <em>Note RH : Aucun avertissement préalable n'a été envoyé.<br>
      L'entretien préalable a eu lieu 3 jours avant la lettre.</em>
    `,
    mission: "Le DRH a invoqué la faute grave pour licencier M. Martin sans lui payer le préavis. Analysez ce dossier : la qualification de faute grave est-elle justifiée ici ? Quelles étapes de la procédure sont respectées ?",
    type: "qcm",
    question: "Pourquoi la qualification de « faute grave » est-elle contestable dans ce dossier ?",
    options: [
      { lettre: "A", texte: "Des retards répétés sans avertissement préalable ne constituent généralement pas une faute grave, car il n'y a pas eu de mise en garde formelle permettant au salarié de se corriger." },
      { lettre: "B", texte: "La faute grave est impossible à invoquer pour un problème de ponctualité, quelle que soit la situation." },
      { lettre: "C", texte: "Le nombre de retards (4) est insuffisant ; il en faudrait au moins 10 pour constituer une faute grave." },
      { lettre: "D", texte: "Le licenciement pour faute grave n'existe pas en droit du travail français." }
    ],
    reponse: 0,
    indice: "La faute grave suppose une violation grave et délibérée des obligations. La jurisprudence exige généralement des sanctions préalables (avertissement, mise à pied) sauf comportement d'une exceptionnelle gravité.",
    explication: "La faute grave prive le salarié de préavis et d'indemnité. Or, des retards — même répétés — sans avertissement préalable sont rarement qualifiés de faute grave. Les juges considèrent que l'employeur aurait dû d'abord sanctionner (avertissement, mise à pied) pour prouver la persistance fautive. De plus, l'entretien 3 jours avant la lettre est trop court (délai minimal recommandé : 5 jours ouvrables).",
    tentativesMax: 2
  },

  {
    id: 2,
    titre: "Le Délai Introuvable",
    notion: "Procédure de licenciement",
    icon: "📋",
    points: 150,
    document: `
      <div class="doc-error">CHRONOLOGIE DU LICENCIEMENT — ERREURS DÉTECTÉES</div><br>
      <strong>Salariée :</strong> Mme Dupont — 5 ans d'ancienneté, CDI<br>
      <strong>Motif :</strong> Insuffisance professionnelle<br><br>
      <strong>Calendrier :</strong><br>
      → <span class="doc-error">Vendredi 3 mars :</span> Convocation à l'entretien préalable (remise en main propre)<br>
      → <span class="doc-error">Mardi 7 mars :</span> Entretien préalable (soit 4 jours après la convocation)<br>
      → <span class="doc-error">Mercredi 8 mars :</span> Envoi de la lettre de licenciement<br><br>
      <em>Note : Mme Dupont n'a pas été informée de son droit<br>
      à se faire assister lors de l'entretien.</em>
    `,
    mission: "Identifiez toutes les irrégularités de procédure dans ce licenciement. Plusieurs erreurs se cumulent — trouvez-les toutes.",
    type: "multi",
    question: "Cochez toutes les irrégularités de procédure présentes dans ce dossier :",
    options: [
      { texte: "Le délai entre la convocation et l'entretien est insuffisant (moins de 5 jours ouvrables)" },
      { texte: "La lettre de licenciement a été envoyée trop tôt après l'entretien (moins de 2 jours ouvrables)" },
      { texte: "Le salarié n'a pas été informé de son droit à se faire assister lors de l'entretien" },
      { texte: "L'insuffisance professionnelle n'est pas un motif légal de licenciement" }
    ],
    reponses: [0, 1, 2],
    indice: "L'article L1232-2 du Code du travail fixe un délai minimal de 5 jours ouvrables entre réception de la convocation et l'entretien. La lettre ne peut être expédiée moins de 2 jours ouvrables après l'entretien.",
    explication: "Trois irrégularités : (1) Le délai convocation→entretien doit être d'au moins 5 jours ouvrables (ici : vendredi au mardi = 3 jours, le samedi ne compte pas). (2) La lettre doit être envoyée au plus tôt 2 jours ouvrables après l'entretien (ici le lendemain = 1 jour). (3) La convocation doit mentionner le droit à assistance. L'insuffisance professionnelle est bien un motif légal (cause réelle et sérieuse).",
    tentativesMax: 2
  },

  {
    id: 3,
    titre: "Les Étapes dans le Désordre",
    notion: "Procédure de licenciement économique",
    icon: "🔄",
    points: 200,
    document: `
      <div class="doc-error">DOSSIER LICENCIEMENT ÉCONOMIQUE — ORDRE DES ÉTAPES ?</div><br>
      <strong>Contexte :</strong> L'entreprise DURAND (50 salariés) supprime 3 postes<br>
      pour difficultés économiques. Le DRH a mélangé les étapes.<br><br>
      <strong>Étapes à remettre dans le bon ordre :</strong><br>
      Le service RH a listé les actions à mener mais dans le désordre.<br>
      Votre mission : reconstituer la procédure légale exacte.<br><br>
      <em>Rappel : entreprise de 50 salariés avec CSE (Comité Social et Économique)</em>
    `,
    mission: "Remettez les étapes de la procédure de licenciement économique dans le bon ordre chronologique (glissez-déposez).",
    type: "ordering",
    items: [
      "Consultation du CSE (Comité Social et Économique)",
      "Recherche de reclassement interne obligatoire",
      "Notification à la DREETS (ex-DIRECCTE) dans les 8 jours",
      "Envoi des lettres de licenciement aux salariés concernés",
      "Respect du délai de réflexion (30 jours pour 2-9 licenciements)",
      "Proposition du CSP (Contrat de Sécurisation Professionnelle)"
    ],
    ordre: [0, 1, 4, 5, 3, 2],
    indice: "La consultation du CSE est toujours première. La DREETS est informée après l'envoi des lettres. Le CSP est proposé avant la lettre de licenciement.",
    explication: "Ordre correct : 1) Consultation CSE → 2) Recherche reclassement → 3) Délai de réflexion (30 jours) → 4) Proposition CSP → 5) Envoi lettres de licenciement → 6) Notification DREETS (dans les 8 jours suivant l'envoi des lettres). La DREETS n'est informée qu'après les licenciements notifiés.",
    tentativesMax: 2
  },

  {
    id: 4,
    titre: "L'Indemnité Mystère",
    notion: "Indemnités de rupture",
    icon: "💶",
    points: 200,
    document: `
      <div class="doc-error">CALCUL DES INDEMNITÉS — VÉRIFICATION REQUISE</div><br>
      <strong>Salarié :</strong> M. Bernard — CDI depuis 6 ans et 3 mois<br>
      <strong>Salaire brut mensuel :</strong> 2 400 €<br>
      <strong>Motif rupture :</strong> Licenciement pour motif personnel (cause réelle et sérieuse)<br><br>
      <span class="doc-highlight">Calcul du DRH :</span><br>
      → Indemnité légale = 2 400 × 6 × <span class="doc-error">1/3</span> = <span class="doc-error">4 800 €</span><br>
      → Préavis = <span class="doc-error">1 mois</span> (selon contrat)<br>
      → Indemnité compensatrice de congés payés = <span class="doc-error">non calculée</span>
    `,
    mission: "Le DRH a fait une erreur dans le calcul de l'indemnité légale de licenciement. Recalculez le montant correct en appliquant les règles légales.",
    type: "fill",
    champs: [
      {
        label: "Pour les 6 premières années : 2 400 € × 6 ×",
        placeholder: "fraction",
        unite: "= ?",
        cle: "fraction_annees",
        reponse: "1/4",
        reponsesValides: ["1/4", "0.25", "un quart"]
      },
      {
        label: "Montant pour les 6 premières années :",
        placeholder: "montant €",
        unite: "€",
        cle: "montant_6ans",
        reponse: "3600",
        reponsesValides: ["3600", "3 600", "3600€", "3 600 €"]
      },
      {
        label: "Pour les 3 mois supplémentaires : 2 400 × (3/12) ×",
        placeholder: "fraction",
        unite: "= ?",
        cle: "fraction_mois",
        reponse: "1/4",
        reponsesValides: ["1/4", "0.25", "un quart"]
      },
      {
        label: "Indemnité légale TOTALE :",
        placeholder: "total €",
        unite: "€",
        cle: "total",
        reponse: "3780",
        reponsesValides: ["3780", "3 780", "3780€", "3 780 €", "3780,00", "3 780,00"]
      }
    ],
    indice: "Depuis le 27/09/2017 : 1/4 de mois de salaire par année d'ancienneté pour les 10 premières années (et 1/3 au-delà). Il faut calculer séparément les années entières et les mois restants.",
    explication: "L'indemnité légale = 1/4 de mois par année pour les ≤10 ans. Pour 6 ans : 2400 × 6 × 1/4 = 3 600 €. Pour les 3 mois (0,25 année) : 2400 × 0,25 × 1/4 = 150 €. Total : 3 750 €. Le DRH avait appliqué 1/3 (ancien barème) au lieu de 1/4.",
    tentativesMax: 3
  },

  {
    id: 5,
    titre: "L'Accord Raté",
    notion: "Rupture conventionnelle",
    icon: "🤝",
    points: 150,
    document: `
      <div class="doc-error">FORMULAIRE RUPTURE CONVENTIONNELLE — ANOMALIES</div><br>
      <strong>Parties :</strong> Mme Chen (salariée, 3 ans d'ancienneté) / Sté DURAND<br>
      <strong>Date signature :</strong> 10 janvier<br>
      <strong>Date rupture prévue :</strong> <span class="doc-error">16 janvier</span> (6 jours après signature)<br><br>
      <span class="doc-highlight">Convention prévoit :</span><br>
      → Indemnité spécifique : <span class="doc-error">1 200 €</span><br>
         (indemnité légale calculée = 1 800 €)<br>
      → Délai de rétractation : <span class="doc-error">non mentionné</span><br>
      → Homologation DREETS : <span class="doc-error">non demandée</span><br>
      → Signature salariée : <span class="doc-error">sous pression selon attestation</span>
    `,
    mission: "Ce dossier de rupture conventionnelle est truffé d'erreurs. Associez chaque problème détecté à sa conséquence juridique.",
    type: "matching",
    gauche: [
      "Délai de rétractation non respecté (trop court)",
      "Indemnité inférieure au minimum légal",
      "Absence d'homologation DREETS",
      "Consentement vicié (pression)"
    ],
    droite: [
      "La rupture conventionnelle est nulle de plein droit",
      "La convention est annulable — le salarié peut saisir les prud'hommes",
      "Le surplus d'indemnité doit être versé obligatoirement",
      "Nullité : la rupture conventionnelle n'existe pas juridiquement"
    ],
    correspondances: [0, 2, 3, 1],
    indice: "Le délai de rétractation est de 15 jours calendaires. L'homologation est obligatoire. L'indemnité ne peut être inférieure à l'indemnité légale de licenciement.",
    explication: "1) Délai < 15 jours calendaires → nullité de la convention. 2) L'indemnité spécifique ne peut être < à l'indemnité légale de licenciement (ici : 3 ans × 1/4 × 2400 = 1800€ minimum). 3) Sans homologation DREETS, la rupture n'a pas d'existence juridique → nullité. 4) Consentement vicié → annulable, requalifiable en licenciement sans cause.",
    tentativesMax: 2
  },

  {
    id: 6,
    titre: "Le Cas Final",
    notion: "Synthèse — Types de rupture",
    icon: "🏆",
    points: 250,
    document: `
      <div class="doc-error">DOSSIERS RESTANTS — CLASSIFICATION URGENTE</div><br>
      Quatre situations doivent être classifiées avant l'arrivée de l'inspection.<br>
      Chaque situation décrit une rupture de contrat de travail différente.<br><br>
      <strong>Situation A :</strong> <span class="doc-highlight">M. Petit quitte volontairement son poste après avoir remis<br>
      une lettre écrite à son employeur, en respectant un préavis de 2 mois.</span><br><br>
      <strong>Situation B :</strong> <span class="doc-highlight">Mme Garcia et son employeur signent d'un commun accord<br>
      la fin de son CDI, avec homologation administrative.</span><br><br>
      <strong>Situation C :</strong> <span class="doc-highlight">M. Dubois est renvoyé immédiatement après avoir frappé<br>
      un collègue dans les locaux de l'entreprise.</span><br><br>
      <strong>Situation D :</strong> <span class="doc-highlight">L'entreprise Durand supprime le poste de Mme Torres<br>
      pour difficultés financières graves et durables.</span>
    `,
    mission: "Associez chaque situation à la nature juridique exacte de la rupture du contrat de travail.",
    type: "matching",
    gauche: [
      "Situation A — M. Petit",
      "Situation B — Mme Garcia",
      "Situation C — M. Dubois",
      "Situation D — Mme Torres"
    ],
    droite: [
      "Licenciement pour motif économique",
      "Licenciement pour faute grave",
      "Rupture conventionnelle homologuée",
      "Démission"
    ],
    correspondances: [3, 2, 1, 0],
    indice: "La démission est toujours à l'initiative du salarié. La faute grave prive de préavis et d'indemnités. La rupture conventionnelle requiert un accord mutuel et une homologation.",
    explication: "A → Démission : initiative du salarié, lettre écrite, préavis. B → Rupture conventionnelle : accord mutuel + homologation DREETS. C → Licenciement faute grave : violence au travail = manquement d'une gravité exceptionnelle, préavis et indemnités supprimés. D → Licenciement économique : suppression de poste pour motif économique réel.",
    tentativesMax: 2
  }
];

const SCORING = {
  bonusTemps: 50,       // bonus si résolu du premier coup ET < 5 min restantes avant timer
  malusIndice: 20,      // pénalité par indice utilisé
  malusEssai: 15,       // pénalité par essai supplémentaire
};
