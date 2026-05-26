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
        reponse: "3750",
        reponsesValides: ["3750", "3 750", "3750€", "3 750 €", "3750,00", "3 750,00"]
      }
    ],
    indice: "Depuis le 27/09/2017 : 1/4 de mois de salaire par année d'ancienneté pour les 10 premières années (et 1/3 au-delà). Il faut calculer séparément les années entières et les mois restants.",
    explication: "L'indemnité légale = 1/4 de mois par année pour les ≤ 10 ans. Pour 6 ans entières : 2 400 × 6 × 1/4 = 3 600 €. Pour les 3 mois (= 0,25 année) : 2 400 × 0,25 × 1/4 = 150 €. Total correct : 3 750 €. Le DRH avait appliqué 1/3 (ancien barème pré-2017) au lieu de 1/4.",
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
  },

  {
    id: 7,
    titre: "La Pochette de Sortie",
    notion: "Retraite, faute lourde, rupture collective et documents de fin de contrat",
    icon: "📦",
    points: 200,
    document: `
      <div class="doc-error">ARMOIRE RH — DOSSIERS À CLASSER</div><br>
      Le service RH retrouve quatre fiches de fin de contrat mélangées.<br>
      Chaque fiche correspond à une notion précise du chapitre.<br><br>
      <strong>Fiche A :</strong> un salarié quitte l'entreprise pour liquider ses droits à la retraite.<br><br>
      <strong>Fiche B :</strong> l'entreprise organise des départs volontaires dans le cadre d'un accord majoritaire avec les syndicats, homologué par l'administration.<br><br>
      <strong>Fiche C :</strong> un salarié a volontairement saboté un dossier client pour nuire à son employeur.<br><br>
      <strong>Fiche D :</strong> le contrat est terminé : le salarié doit recevoir plusieurs documents administratifs.
    `,
    mission: "Associez chaque fiche à la notion ou à l'obligation juridique correspondante.",
    type: "matching",
    gauche: [
      "Fiche A — départ lié à l'âge du salarié",
      "Fiche B — départs volontaires négociés collectivement",
      "Fiche C — volonté de nuire à l'employeur",
      "Fiche D — documents remis à la fin du contrat"
    ],
    droite: [
      "Faute lourde : elle suppose l'intention de nuire et peut engager la responsabilité du salarié",
      "Dernier bulletin de salaire, certificat de travail, attestation employeur et reçu pour solde de tout compte",
      "Départ à la retraite : rupture à l'initiative du salarié",
      "Rupture conventionnelle collective : accord majoritaire homologué par la DREETS (ex-DIRECCTE)"
    ],
    correspondances: [2, 3, 0, 1],
    indice: "Repérez d'abord l'initiative de la rupture : salarié, employeur, accord collectif ou simple obligation administrative.",
    explication: "A → Départ à la retraite : il s'agit d'une rupture à l'initiative du salarié. B → Rupture conventionnelle collective : elle repose sur un accord majoritaire avec les syndicats et une homologation administrative par la DREETS (ex-DIRECCTE). C → Faute lourde : elle suppose une intention de nuire à l'employeur et peut engager la responsabilité du salarié. D → Documents de fin de contrat : dernier bulletin de salaire, certificat de travail, attestation employeur et reçu pour solde de tout compte.",
    tentativesMax: 2
  }
];

const SCORING = {
  bonusTemps: 50,       // bonus si résolu du premier coup ET < 5 min restantes avant timer
  malusIndice: 20,      // pénalité par indice utilisé
  malusEssai: 15,       // pénalité par essai supplémentaire
};

const LEVEL2_ENIGMAS = [
  {
    id: 1,
    titre: "Le salarié fantôme",
    notion: "Abandon de poste et présomption de démission",
    icon: "👻",
    points: 180,
    type: 'multistep',
    tentativesMax: 2,
    document: `
      <div class="doc-error">BOÎTE MAIL RH — ABSENCE NON JUSTIFIÉE</div><br>
      <strong>Salarié :</strong> M. Morel, CDI<br>
      <strong>Situation :</strong> absent depuis 12 jours sans justificatif transmis.<br><br>
      <strong>Mail du manager :</strong><br>
      « Il ne vient plus. On le note démissionnaire aujourd'hui et on clôture le dossier. »<br><br>
      <span class="doc-highlight">Pièces trouvées :</span><br>
      → badge inactif depuis le 8 mai<br>
      → aucun arrêt de travail reçu<br>
      → <span class="doc-error">aucune mise en demeure envoyée</span>
    `,
    mission: "Analysez la situation de M. Morel en 3 étapes : qualifiez juridiquement la situation, reconstituez la procédure légale, puis vérifiez vos connaissances par des questions vrai/faux.",
    indice: "L'abandon de poste ne devient pas automatiquement une démission. Une mise en demeure écrite (LRAR) est obligatoire et le délai de réponse ne peut pas être inférieur à 15 jours calendaires.",
    explication: "L'abandon de poste ne génère pas automatiquement une démission. L'employeur doit adresser une mise en demeure LRAR au salarié lui demandant de justifier son absence ou de reprendre le travail, avec un délai minimum de 15 jours calendaires. Sans réponse ou reprise dans ce délai, la présomption de démission s'applique — mais le salarié peut la contester devant le conseil de prud'hommes.",
    steps: [
      {
        type: 'qcm',
        titre: "Étape 1 — Qualification juridique",
        options: [
          { texte: "Démission : le salarié a clairement manifesté sa volonté de quitter l'entreprise." },
          { texte: "Abandon de poste : absence injustifiée sans que l'employeur puisse présumer immédiatement la démission." },
          { texte: "Licenciement pour faute grave : l'employeur peut rompre le contrat sans délai." },
          { texte: "Congé sans solde : le salarié peut s'absenter librement sans justification." }
        ],
        reponse: 1,
        feedback: {
          correct: "✅ Correct ! L'absence injustifiée constitue un abandon de poste. L'employeur ne peut pas présumer immédiatement la démission sans suivre la procédure légale.",
          incorrect: "❌ L'absence injustifiée est un abandon de poste, pas une démission automatique. Une procédure formelle est obligatoire."
        }
      },
      {
        type: 'ordering',
        titre: "Étape 2 — Procédure légale",
        items: [
          "Constater l'absence injustifiée du salarié",
          "Adresser une mise en demeure LRAR (lettre recommandée avec accusé de réception)",
          "Laisser au salarié un délai de réponse d'au moins 15 jours calendaires",
          "Tirer les conséquences : présomption de démission si absence de réponse ou de reprise"
        ],
        ordre: [0, 1, 2, 3],
        feedback: {
          correct: "✅ Parfait ! Voici la procédure légale exacte : constat → mise en demeure LRAR → délai 15 jours → présomption de démission.",
          incorrect: "❌ L'ordre n'est pas respecté. La mise en demeure LRAR précède toujours le délai, lui-même indispensable avant toute présomption."
        }
      },
      {
        type: 'vf',
        titre: "Étape 3 — Vrai ou Faux",
        questions: [
          { texte: "L'employeur peut qualifier immédiatement un abandon de poste de démission sans autre formalité.", reponse: false },
          { texte: "La mise en demeure doit être adressée par lettre recommandée avec accusé de réception (LRAR).", reponse: true },
          { texte: "Le délai laissé au salarié pour répondre est de 5 jours ouvrables.", reponse: false },
          { texte: "En l'absence de réponse dans le délai imparti, la présomption de démission s'applique.", reponse: true },
          { texte: "Le salarié peut contester la présomption de démission devant le conseil de prud'hommes.", reponse: true }
        ],
        feedback: {
          correct: "✅ Excellent ! Vous maîtrisez la procédure d'abandon de poste et la présomption de démission.",
          incorrect: "❌ Certaines réponses sont incorrectes. Relisez attentivement les règles sur la mise en demeure et les délais."
        }
      }
    ]
  },
  {
    id: 2,
    titre: "Télétravail sous tension",
    notion: "Télétravail, contrôle et droit à la déconnexion",
    icon: "💻",
    points: 160,
    document: `
      <div class="doc-error">INTERFACE TEAMS — SIGNALEMENT MANAGER</div><br>
      <strong>Salariée :</strong> Mme Lenoir, télétravail 3 jours/semaine<br><br>
      <strong>Messages du manager :</strong><br>
      → « Caméra obligatoire toute la journée. »<br>
      → « Réponds à mes messages à 22h, c'est urgent. »<br>
      → « Ton refus suffit pour rompre ton contrat. »<br><br>
      <em>Le règlement interne mentionne seulement des réunions en visioconférence sur les plages horaires habituelles.</em>
    `,
    mission: "Identifiez les affirmations juridiquement contestables dans ce dossier de télétravail.",
    type: "multi",
    question: "Cochez les affirmations fausses ou excessives :",
    options: [
      { texte: "L'employeur peut imposer une webcam allumée toute la journée sans justification proportionnée." },
      { texte: "Le salarié doit répondre aux messages professionnels à 22h en dehors de ses horaires habituels." },
      { texte: "Le télétravail supprime le pouvoir de direction de l'employeur." },
      { texte: "Un refus ponctuel d'allumer sa caméra suffit automatiquement à rompre le contrat." }
    ],
    reponses: [0, 1, 2, 3],
    indice: "Le contrôle de l'activité doit rester justifié et proportionné. Le salarié conserve ses droits, notamment au repos et à la déconnexion.",
    explication: "Toutes les propositions sont excessives. Le télétravail n'efface pas le pouvoir de direction, mais les contrôles doivent être proportionnés et compatibles avec les libertés individuelles. Le salarié n'a pas à répondre en permanence hors temps de travail. Une sanction éventuelle doit être justifiée, proportionnée et respecter la procédure disciplinaire.",
    tentativesMax: 2
  },
  {
    id: 3,
    titre: "L'apprenti disparu",
    notion: "Rupture du contrat d'apprentissage",
    icon: "🎓",
    points: 180,
    document: `
      <div class="doc-error">ESCAPE DOSSIER — CONTRAT D'APPRENTISSAGE</div><br>
      <strong>Apprenti :</strong> Sami, 17 ans<br>
      <strong>Conflit :</strong> altercation répétée avec son tuteur.<br><br>
      <strong>Phrase du directeur :</strong><br>
      « Un apprenti ne peut jamais rompre son contrat, il doit rester jusqu'au bout. »<br><br>
      <span class="doc-highlight">Documents retrouvés :</span><br>
      contrat, échanges de mails, témoignages, note du CFA.
    `,
    mission: "Associez chaque situation à la bonne possibilité de rupture du contrat d'apprentissage.",
    type: "matching",
    gauche: [
      "Rupture pendant les 45 premiers jours de formation pratique en entreprise",
      "Les deux parties sont d'accord pour arrêter le contrat",
      "L'employeur invoque une faute grave de l'apprenti",
      "L'apprenti veut rompre après la période initiale, à la suite d'un conflit"
    ],
    droite: [
      "Rupture possible après saisine du médiateur et information de l'employeur",
      "Rupture unilatérale possible pendant la période initiale",
      "Rupture d'un commun accord formalisée par écrit",
      "Rupture possible par l'employeur en respectant la procédure applicable"
    ],
    correspondances: [1, 2, 3, 0],
    indice: "Le contrat d'apprentissage peut être rompu dans plusieurs cas : période initiale, accord commun, faute grave, ou démarche encadrée de l'apprenti après médiation.",
    explication: "Le directeur a tort : un contrat d'apprentissage peut être rompu dans des cas prévus. Pendant les 45 premiers jours de formation pratique, la rupture est plus simple. Ensuite, elle peut notamment intervenir par accord commun, par l'employeur dans certains cas graves, ou à l'initiative de l'apprenti après saisine du médiateur.",
    tentativesMax: 2
  },
  {
    id: 4,
    titre: "L'algorithme RH",
    notion: "IA, libertés et droit du travail",
    icon: "🤖",
    points: 220,
    document: `
      <div class="doc-error">TABLEAU DE BORD IA RH — MODE AUTOMATIQUE</div><br>
      <strong>Outil :</strong> ALGO-RH 4.2<br><br>
      <strong>Actions détectées :</strong><br>
      → notation automatique des salariés<br>
      → surveillance d'activité continue<br>
      → proposition de licenciement sans contrôle humain<br>
      → statistiques défavorables à certains profils<br><br>
      <em>Un salarié conteste son licenciement : il n'a jamais obtenu d'explication humaine sur la décision.</em>
    `,
    mission: "Désactivez l'algorithme RH en identifiant les trois risques juridiques principaux.",
    type: "multi",
    question: "Quels problèmes doivent être retenus ?",
    options: [
      { texte: "Risque de discrimination si les décisions défavorisent certains profils sans justification objective." },
      { texte: "Absence de contrôle humain sur une décision qui produit un effet important pour le salarié." },
      { texte: "Atteinte possible aux libertés individuelles en cas de surveillance excessive ou permanente." },
      { texte: "Une IA peut toujours licencier seule si elle donne une note chiffrée." }
    ],
    reponses: [0, 1, 2],
    indice: "Cherchez les mots-clés : discrimination, contrôle humain, libertés individuelles, information des salariés et rôle des représentants du personnel.",
    explication: "Une décision importante ne doit pas être abandonnée à un système automatisé sans garanties. Les salariés doivent pouvoir comprendre et contester une décision significative, demander une intervention humaine, et être protégés contre les discriminations et les surveillances disproportionnées. Le CSE peut aussi avoir un rôle d'information/consultation sur les outils de contrôle de l'activité.",
    tentativesMax: 2
  }
];

const LEVELS = [
  {
    titre: "Niveau 1 — Rupture du contrat de travail",
    label: "Niveau 1",
    resultTitle: "Niveau 1 terminé",
    enigmas: ENIGMAS
  },
  {
    titre: "Niveau 2 — Nouvelles formes de rupture et transformations du travail",
    label: "Niveau 2",
    resultTitle: "Niveau 2 terminé",
    enigmas: LEVEL2_ENIGMAS
  },
  {
    titre: "Mission finale — Mot croisé juridique",
    label: "Mission finale",
    resultTitle: "Mission finale réussie",
    enigmas: [
      {
        id: 1,
        titre: "Le mot croisé du droit social",
        notion: "Notions juridiques à retenir",
        icon: "🧩",
        points: 300,
        document: `
          <div class="doc-error">SALLE DES ARCHIVES — VERROU FINAL</div><br>
          Les deux niveaux sont terminés. Pour fermer définitivement le dossier de l'entreprise Durand,
          complétez la grille avec les notions essentielles de la rupture du contrat de travail.<br><br>
          <span class="doc-highlight">Objectif :</span> retrouver les mots-clés vus dans les missions :
          procédure, rupture, contrôle administratif, télétravail, apprentissage et IA.
        `,
        mission: "Complétez le mot croisé avec les notions juridiques à retenir. Les réponses sont à saisir sans accent.",
        type: "crossword",
        rows: 15,
        cols: 15,
        words: [
          { numero: 1, reponse: "RECLASSEMENT", row: 7, col: 1, dir: "H", indice: "Recherche d'un autre poste compatible avant certains licenciements." },
          { numero: 2, reponse: "HOMOLOGATION", row: 3, col: 4, dir: "V", indice: "Validation administrative obligatoire d'une rupture conventionnelle." },
          { numero: 3, reponse: "TELETRAVAIL", row: 4, col: 8, dir: "V", indice: "Organisation du travail à distance, encadrée par des règles et des plages horaires." },
          { numero: 4, reponse: "APPRENTI", row: 7, col: 5, dir: "V", indice: "Jeune salarié formé en alternance dans une entreprise et un CFA." },
          { numero: 5, reponse: "DEMISSION", row: 3, col: 7, dir: "V", indice: "Rupture du CDI à l'initiative claire et non équivoque du salarié." },
          { numero: 6, reponse: "DREETS", row: 3, col: 7, dir: "H", indice: "Administration compétente notamment pour l'homologation des ruptures conventionnelles." },
          { numero: 7, reponse: "PREAVIS", row: 5, col: 10, dir: "V", indice: "Période travaillée ou indemnisée entre l'annonce de la rupture et le départ effectif." },
          { numero: 8, reponse: "FAUTE", row: 11, col: 1, dir: "H", indice: "Manquement du salarié pouvant justifier une sanction ou un licenciement." },
          { numero: 9, reponse: "CSE", row: 6, col: 6, dir: "V", indice: "Instance représentative consultée dans plusieurs procédures collectives." },
          { numero: 10, reponse: "IA", row: 6, col: 5, dir: "V", indice: "Outil numérique qui ne doit pas décider seul d'une rupture produisant des effets importants." }
        ],
        indice: "Commencez par les mots longs : reclassement, homologation, télétravail. Les croisements donnent ensuite les mots courts.",
        explication: "Les notions clés à retenir : reclassement, homologation, télétravail, apprenti, démission, DREETS, préavis, faute, CSE et IA. Elles résument les principales garanties : procédure écrite, contrôle administratif ou humain, information du salarié et respect des libertés fondamentales.",
        tentativesMax: 3
      }
    ]
  }
];

const GLOSSARY = [
  { terme: "Abandon de poste", definition: "Absence injustifiée du salarié à son poste. Elle peut conduire à une sanction ou, sous conditions, à une présomption de démission." },
  { terme: "Cause réelle et sérieuse", definition: "Motif objectif, exact et suffisamment important permettant de justifier un licenciement." },
  { terme: "CSE", definition: "Comité social et économique, instance représentative du personnel informée ou consultée dans certaines procédures." },
  { terme: "Démission", definition: "Rupture du contrat à l'initiative du salarié, exprimée de manière claire et non équivoque." },
  { terme: "Départ à la retraite", definition: "Rupture du CDI à l'initiative du salarié qui quitte l'entreprise pour faire valoir ses droits à la retraite." },
  { terme: "Dernier bulletin de salaire", definition: "Document remis à la fin du contrat indiquant la dernière rémunération et les sommes versées au salarié." },
  { terme: "Dommages-intérêts", definition: "Somme pouvant être versée pour réparer un préjudice, par exemple en cas de licenciement abusif ou de préavis non respecté." },
  { terme: "DREETS", definition: "Administration du travail, anciennement DIRECCTE, compétente notamment pour l'homologation des ruptures conventionnelles." },
  { terme: "Faute grave", definition: "Faute rendant impossible le maintien du salarié dans l'entreprise, même pendant le préavis." },
  { terme: "Faute lourde", definition: "Faute d'une particulière gravité commise avec l'intention de nuire à l'employeur ou à l'entreprise." },
  { terme: "Homologation", definition: "Validation administrative nécessaire pour rendre une rupture conventionnelle effective." },
  { terme: "Indemnité de licenciement", definition: "Somme due au salarié licencié lorsqu'il remplit les conditions légales, sauf exceptions comme la faute grave." },
  { terme: "Mise en demeure", definition: "Demande écrite adressée au salarié pour qu'il justifie son absence ou reprenne son poste dans un délai fixé." },
  { terme: "Préavis", definition: "Délai entre la notification de la rupture et la fin effective du contrat." },
  { terme: "Présomption de démission", definition: "Mécanisme permettant, sous conditions strictes, de considérer un abandon de poste comme une démission." },
  { terme: "Reclassement", definition: "Recherche d'un poste disponible et compatible avant certains licenciements, notamment économiques." },
  { terme: "Certificat de travail", definition: "Document remis au salarié à la fin du contrat attestant notamment de son emploi et de ses dates de présence." },
  { terme: "Attestation employeur", definition: "Document destiné à France Travail permettant au salarié de faire valoir ses droits éventuels à l'assurance chômage." },
  { terme: "Reçu pour solde de tout compte", definition: "Document qui récapitule les sommes versées au salarié lors de la rupture du contrat." },
  { terme: "Rupture conventionnelle", definition: "Rupture du CDI d'un commun accord entre employeur et salarié, avec délai de rétractation et homologation." },
  { terme: "Rupture conventionnelle collective", definition: "Dispositif collectif de départs volontaires fondé sur un accord majoritaire avec les syndicats et une homologation administrative." },
  { terme: "Télétravail", definition: "Organisation dans laquelle le salarié travaille hors des locaux de l'entreprise grâce aux outils numériques." },
  { terme: "Droit à la déconnexion", definition: "Droit de ne pas être sollicité professionnellement en permanence hors temps de travail." },
  { terme: "Décision automatisée", definition: "Décision prise par un système informatique ou une IA ; elle doit respecter les droits du salarié et permettre un contrôle humain lorsqu'elle produit des effets importants." }
];
