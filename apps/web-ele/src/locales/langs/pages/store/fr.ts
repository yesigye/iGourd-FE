// 门店列表
export default {
  storeForm: {
    business_type: {
      label: "Type d'entreprise",
      placeholder: "Sélectionner le type d'entreprise"
    },
    full_name: {
      label: 'Nom du magasin',
      placeholder: 'Saisir le nom du magasin'
    },
    short_name: {
      label: 'Nom court du magasin',
      placeholder: 'Saisir le nom court du magasin'
    },
    industry_code: {
      label: 'Secteur du magasin',
      placeholder: 'Sélectionner le secteur du magasin'
    },
    time_zone_id: {
      label: 'Fuseau horaire',
      placeholder: 'Choisir un fuseau horaire'
    },
    country_id: {
      label: 'Pays',
      placeholder: 'Sélectionner un pays'
    },
    actual_address: {
      label: 'Adresse',
      placeholder: "Saisir l'adresse"
    },
    basic_currency_code: {
      label: 'Devise de base',
      placeholder: 'Sélectionner la devise de base'
    },
    majorCountry_language: {
      label: 'Paramètres de langue',
      placeholder: 'Sélectionner la langue principale'
    },
    minorCountry_language: {
      label: 'Paramètres de langue',
      placeholder: 'Choisir une langue secondaire'
    },
    merchantExisted: 'Le nom du marchand existe déjà'
  },
  standardCard: {
    monthAmountUnit: 'mois',
    moduleTitle: 'Module de fonction',
    employeeTitle: "Limite d'employés"
  },
  storeEdition: {},
  storePackage: {
    purchaseBtn: 'Acheter',
    monthAmountUnit: 'mois',
    payableTitle: 'Montant à payer',
    methodTitle: 'Veuillez sélectionner un mode de paiement',
    methodOffline: 'Paiement hors ligne',
    placeButton: 'Passer la commande',
    payableAmount: 'Montant',
    payableDiscount: 'Remise',
    payableFee: 'Frais initiaux de service',
    payableOrigin: 'Montant déduit du forfait original',
    total: 'Total',
    payment_method_CASH: 'Paiement en espèces',
    payment_method_OFFLINE_BANK_TRANSFER: 'Virement bancaire hors ligne'
  },
  storePayment: {
    payAmount: 'Montant à payer',
    accpetBank: 'Banque acceptée',
    accpetBankSub: "Veuillez virer le montant spécifié, sinon l'achat échouera",
    accpetAccmout: 'Compte accepté',
    copyAccount: 'copier le compte',
    swiftCode: 'Code Swift',
    recipient: "Nom de l'entreprise bénéficiaire",
    paidAlready: 'Déjà payé',
    copySuccess: 'Copie réussie',
    frameMessage:
      'Vous avez sélectionné le paiement hors ligne, si le paiement a été effectué, veuillez cliquer sur Payé'
  },
  storeComplete: {
    creationTitleAPPROVED: 'Vérification terminée',
    creationTitleREJECTED: 'Échec de la création',
    creationTitlePENDING: 'Transaction en cours de vérification',
    creationMessageAPPROVED:
      'La vérification de votre compte est terminée. Vous pouvez maintenant vous connecter et commencer à utiliser nos services.',
    creationMessageREJECTED:
      "La vérification de votre compte n'a pas été approuvée. Veuillez contacter le personnel commercial hors ligne pour enquêter sur la raison! Recréez la vitrine.",
    creationMessagePENDING:
      "Votre transaction est actuellement en cours de vérification, veuillez patienter. Nous terminerons la vérification dans un jour ouvrable, veuillez faire attention à vos e-mails ou messages texte. Après une vérification réussie, vous pourrez vous connecter et accéder à la page d'accueil.",
    auditText: "Registres d'audit",
    // creationBtnTextAPPROVED: 'Aller à la connexion',
    creationBtnTextAPPROVED: 'Retour',
    creationBtnTextREJECTED: 'Retour',
    creationBtnTextPENDING: 'Retour',
    emptyText: 'Aucune donnée'
  },
  storeList: {
    title: 'Liste des magasins',
    updateSuccess: 'Modifié avec succès',
    search: 'Recherche',
    add: 'Ajouter',
    fieldsBtn: 'Champs',
    storecode: 'Code du magasin',
    storeabbreviation: 'Abréviation du magasin',
    storename: 'Nom du magasin',
    business_type: "Type d'entreprise",
    storeindustry: 'Secteur du magasin',
    state: 'État',
    creationtime: 'Date de création',
    address: 'Adresse',
    timezone: 'Fuseau horaire',
    country: 'Pays',
    basicCurrency: 'Devise de base',
    searchInput: 'Entrez les mots-clés à rechercher (abréviation du magasin, nom du magasin)',
    id: 'ID du magasin',
    short_name: 'Nom court du magasin',
    full_name: 'Nom du magasin',
    industry_name: 'Secteur du magasin',
    status: 'État',
    upgradeService: 'Upgrade Service',
    create_time: 'Date de création',
    final_expiration_time: 'Validité du forfait',
    owned_quantity: "Qté d'appareils",
    used_quantity: "Qté d'appareils utilisés",
    package: 'Forfait',
    device: "Autorisation d'appareil",
    action: 'Opérer',
    renew: 'Renouveler',
    upgrade: 'Mettre à niveau',
    authorize: 'Autoriser',
    auditRecord: "Registre d'audit",
    editTitle: 'Modifier',
    submitBtnText: 'Enregistrer',
    status_NONACTIVATED: 'NON ACTIVÉ',
    status_OPEN: 'OUVERT',
    status_FROZE: 'GELÉ',
    status_CLOSED: 'FERMÉ',
    status_EXPIRED: 'EXPIRÉ',
    qty_chang_title: 'Registro de alteração de quantidade',
    source_BUY: 'Comprar {count} dispositivos',
    source_BUY_DEVICE: 'Comprar dispositivo com {count} dispositivos de brinde',
    source_BUY_PACKAGE: 'Comprar pacote com {count} dispositivos de brinde'
  },
  storePaymentList: {
    title: 'Historique des commandes',
    merchant_order_no: 'ID de commande',
    storename: 'Nom du magasin',
    package_name: 'Nom du service',
    total_day: 'Nombre de jours',
    discount_amount: 'Remise',
    total_amount: 'Montant',
    payment_method: 'Type de paiement',
    type: 'Mode de paiement',
    status: 'État de révision',
    create_time: 'Date de création',
    payment_method_NO_PAYMENT: 'PAS DE PAIEMENT',
    payment_method_CASH: 'ESPÈCES',
    payment_method_OFFLINE_WECHAT: 'WECHAT HORS LIGNE',
    payment_method_OFFLINE_ALIPAY: 'ALIPAY HORS LIGNE',
    payment_method_ONLINE_WECHAT: 'WECHAT EN LIGNE',
    payment_method_ONLINE_ALIPAY: 'ALIPAY EN LIGNE',
    payment_method_ONLINE_BANKING: 'BANQUE EN LIGNE',
    payment_method_OFFLINE_BANK_TRANSFER: 'VIREMENT BANCAIRE HORS LIGNE',
    type_INNER_TRADE: 'COMMERCE INTERNE',
    type_MERCHANT_PACKAGE_BUY: 'ACHAT DE FORFAIT MARCHAND',
    type_MERCHANT_GOODS_BUY: 'ACHAT DE MARCHANDISES',
    type_OTHER: 'AUTRE',
    status_INIT: 'INITIAL',
    status_SUCCESS: 'RÉUSSI',
    status_CANCEL: 'ANNULÉ',
    status_REFUND: 'REMBOURSÉ',
    status_REFUNDING: 'EN COURS DE REMBOURSEMENT',
    status_REFUNDFAIL: 'ÉCHEC DU REMBOURSEMENT',
    enroll_status_PENDING: 'EN ATTENTE',
    enroll_status_APPROVED: 'APPROUVÉ',
    enroll_status_REJECTED: 'REJETÉ'
  },
  storeDevice: {
    title: "Autorisation d'appareil",
    searchPlaceholder: 'Entrez les mots-clés à rechercher (nom du dispositif, code du dispositif)',
    storename: 'Nom du magasin',
    short_name: 'Nom court du magasin',
    code: "Code d'appareil",
    name: "Nom d'appareil",
    mac_address: 'Adresse Mac',
    ip_address: 'IP de connexion',
    last_login_time: 'Temps de connexion',
    login_count: 'Login Count',
    software_version: 'Numéro de version',
    version_update_time: 'Date de mise à jour de version',
    os_version: "Version du système d'exploitation",
    type: "Type d'appareil",
    is_authorized: 'Autorisation',
    status: 'Désactivé',
    status_ACTIVE: 'ACTIF',
    status_FROZEN: 'GELÉ',
    status_PROHIBITED: 'INTERDIT',
    type_POS: 'PDV',
    type_HANDHELD_TERMINAL: 'TERMINAL PORTABLE',
    type_PRICE_INCREASER: 'AUGMENTATEUR DE PRIX',
    type_SCAN_PRINT_ALL_IN_ONE: 'TOUT-EN-UN SCAN IMPRESSION'
  },
  storeIndustry: {
    Catering: 'Restauration',
    Bakery: 'Boulangerie',
    Retail: 'Commerce de détail',
    'Apparel and Footwear': 'Vêtements et chaussures',
    'Fresh Food': 'Produits frais',
    'Maternity and Infant': 'Maternité et bébé',
    Beauty: 'Beauté',
    'Arts Training': 'Formation artistique',
    Pet: 'Animaux de compagnie',
    'Life Services': 'Services de la vie quotidienne',
    'Wholesale and Trade': 'Commerce de gros',
    Other: 'Autres'
  }
};
