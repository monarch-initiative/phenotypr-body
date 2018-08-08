/**
 * Array of high-level HPO terms that are used to constrain the search criteria.
 * @type {Array}
 */
const systems = [{
  'label': 'Growth',
  'helpText': 'For example you are much shorter or taller than expected for your family, you have had significant and/or lifelong problems gaining weight, or you have significant and/or lifelong problems with obesity. You may have seen an endocrinologist or other specialist for these issues.',
  'hpoLabel': 'Growth abnormality',
  'id': 'HP:0001507',
  'note': 'Growth: For example you are much shorter or taller than expected for your family, you have had significant and/or lifelong problems gaining weight, or you have significant and/or lifelong problems with obesity. You may have seen an endocrinologist or other specialist for these issues.'
},
{
  'label': 'Hormone / Endocrine',
  'helpText': 'Eg. Diabetes, thyroid issues, reduced functioning of the gonads (ovaries or testes) with reduced production of sex hormones.',
  'hpoLabel': 'Abnormality of the endocrine system',
  'id': 'HP:0000818',
  'note': 'Hormone / Endocrine: Eg. Diabetes, thyroid issues, reduced functioning of the gonads (ovaries or testes) with reduced production of sex hormones.'
},
{
  'label': 'Cancer',
  'helpText': 'Any type, any time. Examples: Breast cancer, prostate cancer, osteosarcoma, or lymphoma. You may have seen an oncologist for these issues.',
  'hpoLabel': 'Neoplasm',
  'id': 'HP:0002664',
  'note': 'Cancer: Any type, any time. Examples: Breast cancer, prostate cancer, osteosarcoma, or lymphoma. You may have seen an oncologist for these issues.'
},
{
  'label': 'Head/Face/Neck',
  'helpText': 'Parts of your head, face, and neck that may be different, in terms of its appearance or how it works. Please note that we are asking you about SIGNIFICANT issues with these areas, problems that you have seen a doctor for, or had surgery for, or problems that you don\'t notice often in other people. The doctor may have used the term “dysmorphic” in describing some features of your face.\n\nExamples: Differences in head or neck shape or size or issues with facial features or structure. You may have had to see a special doctor for these issues or had a surgery to correct them, for instance cleft palate.',
  'hpoLabel': 'Abnormality of the head and neck',
  'id': 'HP:0000152',
  'note': 'Head/Face/Neck: Parts of your head, face, and neck that may be different, in terms of its appearance or how it works. Please note that we are asking you about SIGNIFICANT issues with these areas, problems that you have seen a doctor for, or had surgery for, or problems that you don\t notice often in other people. The doctor may have used the term “dysmorphic” in describing some features of your face.\n\nExamples: Differences in head or neck shape or size or issues with facial features or structure. You may have had to see a special doctor for these issues or had a surgery to correct them, for instance cleft palate.'
},
{
  'label': 'Eyes / vision',
  'helpText': 'Examples: Vision loss, cataracts, or “lazy eye.” You may have seen an optometrist or ophthalmologist (eye doctors) for these issues.',
  'hpoLabel': 'Abnormality of the eye',
  'id': 'HP:0000478',
  'note': 'Eyes / vision: Examples: Vision loss, cataracts, or “lazy eye.” You may have seen an optometrist or ophthalmologist (eye doctors) for these issues.'
},
{
  'label': 'Ears / hearing',
  'helpText': 'Examples: Hearing loss, ringing in the ears, or misshapen ears. You may have seen an audiologist or Ears/Nose/Throat (ENT) doctor for these issues.',
  'hpoLabel': 'Abnormality of the ear',
  'id': 'HP:0000598',
  'note': 'Ears / hearing: Examples: Hearing loss, ringing in the ears, or misshapen ears. You may have seen an audiologist or Ears/Nose/Throat (ENT) doctor for these issues.'
},
{
  'label': 'Brain / nervous system',
  'helpText': 'Examples: Developmental delays, intellectual disability, learning problems, seizures, significant problems with muscle tone, cerebral palsy, or problems with brain structure. You may have seen a neurologist for these issues.',
  'hpoLabel': 'Abnormality of the nervous system',
  'id': 'HP:0000707',
  'note': 'Brain / nervous system: Examples: Developmental delays, intellectual disability, learning problems, seizures, significant problems with muscle tone, cerebral palsy, or problems with brain structure. You may have seen a neurologist for these issues.'
},
{
  'label': 'Behavioral / psychiatric',
  'helpText': 'Examples: Autism spectrum disorders, schizophrenia, anxiety, aggression, repetitive behaviors, and depression. You may have seen a developmental pediatrician, psychologist, psychiatrist, or therapist for these issues.',
  'hpoLabel': 'Behavioural/Psychiatric Abnormality',
  'id': 'HP:0000708',
  'note': 'Behavioral / psychiatric: Examples: Autism spectrum disorders, schizophrenia, anxiety, aggression, repetitive behaviors, and depression. You may have seen a developmental pediatrician, psychologist, psychiatrist, or therapist for these issues.'
},
{
  'label': 'Skin',
  'helpText': 'Unusual skin coloration, lumps or bumps that needed to be looked at by a doctor, or sweating issues. You may have seen a dermatologist for these issues.',
  'hpoLabel': 'Abnormality of the Integument',
  'id': 'HP:0001574',
  'note': 'Skin: Unusual skin coloration, lumps or bumps that needed to be looked at by a doctor, or sweating issues. You may have seen a dermatologist for these issues.'
},
{
  'label': 'Bones / cartilage / connective tissue',
  'helpText': 'Examples: Issues with easily broken bones, extreme flexibility, or the look/use of your arms, legs, hands, and/or feet. You may have seen an orthopedist or other special doctor for these issues.',
  'hpoLabel': 'Abnormality of the skeletal system',
  'id': 'HP:0000924',
  'note': 'Bones / cartilage / connective tissue: Examples: Issues with easily broken bones, extreme flexibility, or the look/use of your arms, legs, hands, and/or feet. You may have seen an orthopedist or other special doctor for these issues.'
},
{
  'label': 'Muscles',
  'helpText': 'Significant issues with the way your muscles are formed or the way they work, including muscle weakness, burning, or stiffness. You may have seen a neurologist, orthopedist, or other special doctor for these issues.',
  'hpoLabel': 'Abnormality of the musculature',
  'id': 'HP:0003011',
  'note': 'Muscles: Significant issues with the way your muscles are formed or the way they work, including muscle weakness, burning, or stiffness. You may have seen a neurologist, orthopedist, or other special doctor for these issues.'
},
{
  'label': 'Heart / blood vessels',
  'helpText': 'Cardiomyopathy, heart defects needing surgery, widened/bulging blood vessel, or problems with heart rhythm.  You may have seen a cardiologist for these issues.',
  'hpoLabel': 'Abnormality of the cardiovascular system',
  'id': 'HP:0001626',
  'note': 'Heart / blood vessels: Cardiomyopathy, heart defects needing surgery, widened/bulging blood vessel, or problems with heart rhythm.  You may have seen a cardiologist for these issues.'
},
{
  'label': 'Lungs / breathing',
  'helpText': 'Examples: A collapsed lung, fluid on the lungs, or apnea. You may have seen a pulmonologist for these issues.',
  'hpoLabel': 'Abnormality of the Respiratory System',
  'id': 'HP:0002086',
  'note': 'Lungs / breathing: Examples: A collapsed lung, fluid on the lungs, or apnea. You may have seen a pulmonologist for these issues.'
},
{
  'label': 'Digestive / gastrointestinal (GI)',
  'helpText': 'Examples: Issues with the structure or use of your stomach or intestines, extreme issues with constipation, reflux, and/or vomiting. You may have seen a GI (gastrointestinal) doctor for these issues.',
  'hpoLabel': 'Abnormality of the Digestive System',
  'id': 'HP:0025031',
  'note': 'Digestive / gastrointestinal (GI): Examples: Issues with the structure or use of your stomach or intestines, extreme issues with constipation, reflux, and/or vomiting. You may have seen a GI (gastrointestinal) doctor for these issues.'
},
{
  'label': 'Kidneys / bladder / genitals',
  'helpText': 'Issues with urination, kidneys, or reproductive system, including concerns about how these body parts look or work. Some specific examples are hypospadius, kidney failure, infertility, and incontinence. You may have seen a nephrologist, urologist, gynecologist, or other special doctor for these issues.',
  'hpoLabel': 'Abnormality of the Genitourinary System',
  'id': 'HP:0000119',
  'note': 'Kidneys / bladder / genitals: Issues with urination, kidneys, or reproductive system, including concerns about how these body parts look or work. Some specific examples are hypospadius, kidney failure, infertility, and incontinence. You may have seen a nephrologist, urologist, gynecologist, or other special doctor for these issues.'
},
{
  'label': 'Immune system',
  'helpText': 'Frequent infections or immunodeficiency, autoimmune disorders. You may have seen an immunologist for these issues.',
  'hpoLabel': 'Abnormality of the immune system',
  'id': 'HP:0002715',
  'note': 'Immune system: Frequent infections or immunodeficiency, autoimmune disorders. You may have seen an immunologist for these issues.'
},
{
  'label': 'Blood / bleeding',
  'helpText': 'Examples: Excessive bleeding or problems noted with your blood cells on lab reports. You may have seen a hematologist for these issues.',
  'hpoLabel': 'Abnormality of blood and blood-forming tissues',
  'id': 'HP:0001871',
  'note': 'Blood / bleeding: Examples: Excessive bleeding or problems noted with your blood cells on lab reports. You may have seen a hematologist for these issues.'
}
];

export default systems;
