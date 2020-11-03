// lists services and their departments
const serviceNames = [
    "Blood Collection",
    "Medicine Delivery to Home",
    "Blood Sugar Test",
    "Hemodialysis Request",
    "ECG",
    "Nebulization",
    "Tonometry",
    "Vital Signs Checkup",
    "IM and IV Injections",
    "Post-operative follow-up",
    "Physiotherapy"
]

const services = [{
        name: "Blood Collection",
        departments: [
            "Nurse",
            "Lab"
        ]
    },
    {
        name: "Medicine Delivery to Home",
        departments: [
            "Pharmacy",
            "Delivery"
        ]
    },
    {
        name: "Blood Sugar Test",
        departments: [
            "Nurse"
        ]
    },
    {
        name: "Hemodialysis Request",
        departments: [
            "Delivery"
        ]
    },
    {
        name: "ECG",
        departments: [
            "Nurse",
            "Doctor"
        ]
    },
    {
        name: "Nebulization",
        departments: [
            "Nurse"
        ]
    },
    {
        name: "Tonometry",
        departments: [
            "Nurse",
            "Doctor"
        ]
    },
    {
        name: "Vital signs checkup",
        departments: [
            "Nurse",
            "Doctor"
        ]
    },
    {
        name: "IM and IV injections",
        departments: [
            "Nurse"
        ]
    },
    {
        name: "Post-operative follow-up",
        departments: [
            "Nurse",
            "Doctor"
        ]
    },
    {
        name: "Physiotherapy",
        departments: [
            "Physiotherapist"
        ]
    },

];

const serviceStates = {
    bloodCollectionStates: [
        "collecting clood",
        "delivering to lab",
        "saving results",
        "fufilled"
    ],
    hemodialysisStates: [
        "transfering patient",
        "fufilled"
    ],
    medicineDeliveryStates: [
        "preparing prescription",
        "delivering medicine",
        'requesting signature',
        'fufilled'
    ],
    homeMedicalServicesStates: [
        'conducting service',
        'recording results',
        'taking action',
        'fufilled'
    ]
};


module.exports = {
    services,
    serviceNames,
    serviceStates
};