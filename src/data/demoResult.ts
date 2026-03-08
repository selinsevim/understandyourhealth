export const DEMO_RESULT = {
  overallStatus: "watch" as const,
  overallSummary:
    "Overall, your results look quite good! Most of your blood counts are perfectly healthy. Your cholesterol is a little high, which is very common and easy to work on with small lifestyle changes. Nothing urgent here — just a couple of areas to keep an eye on.",
  sections: [
    {
      category: "Hematology",
      sectionName: "Blood Cell Counts",
      items: [
        {
          testName: "White Blood Cells",
          originalName: "WBC",
          value: "7.2 K/uL",
          normalRange: "4.5–11.0 K/uL",
          status: "normal" as const,
          simpleExplanation:
            "Your white blood cells are in a healthy range, meaning your immune system looks good.",
          detailedExplanation:
            "White blood cells help your body fight infections. Your level of 7.2 is comfortably within the normal range of 4.5–11.0, which suggests your immune system is functioning well with no signs of infection or inflammation.",
        },
        {
          testName: "Red Blood Cells",
          originalName: "RBC",
          value: "4.8 M/uL",
          normalRange: "4.2–5.4 M/uL",
          status: "normal" as const,
          simpleExplanation:
            "Your red blood cells are normal — your body is carrying oxygen well.",
          detailedExplanation:
            "Red blood cells carry oxygen throughout your body. At 4.8, you're well within the healthy range. This means your body is getting the oxygen it needs to function properly.",
        },
        {
          testName: "Hemoglobin",
          originalName: "HgB",
          value: "14.2 g/dL",
          normalRange: "13.5–17.5 g/dL",
          status: "normal" as const,
          simpleExplanation:
            "Hemoglobin is normal — no signs of anemia.",
          detailedExplanation:
            "Hemoglobin is the protein in red blood cells that carries oxygen. Your level of 14.2 is perfectly normal, which means you're not anemic and your body's oxygen transport is working as it should.",
        },
        {
          testName: "Hematocrit",
          originalName: "Hematocrit",
          value: "42%",
          normalRange: "41–53%",
          status: "normal" as const,
          simpleExplanation:
            "The proportion of red blood cells in your blood is healthy.",
          detailedExplanation:
            "Hematocrit measures the percentage of your blood that is made up of red blood cells. At 42%, you're right in the normal range, confirming that your blood composition is balanced.",
        },
        {
          testName: "Platelets",
          originalName: "Platelets",
          value: "320 K/uL",
          normalRange: "150–400 K/uL",
          status: "normal" as const,
          simpleExplanation:
            "Your platelet count is normal — your blood clots as it should.",
          detailedExplanation:
            "Platelets help your blood clot when you get a cut or bruise. Your count of 320 is well within the normal range, so your body's clotting ability is functioning properly.",
        },
      ],
    },
    {
      category: "Cardiovascular",
      sectionName: "Heart & Cholesterol",
      items: [
        {
          testName: "Total Cholesterol",
          originalName: "Total Cholesterol",
          value: "215 mg/dL",
          normalRange: "<200 mg/dL",
          status: "watch" as const,
          simpleExplanation:
            "Your total cholesterol is slightly above the ideal level.",
          detailedExplanation:
            "A total cholesterol of 215 is considered borderline high. It's not alarming, but it's worth paying attention to. Small changes like eating more fiber, reducing saturated fats, and staying active can help bring this number down over time.",
        },
        {
          testName: "Bad Cholesterol (LDL)",
          originalName: "LDL",
          value: "142 mg/dL",
          normalRange: "<100 mg/dL",
          status: "concern" as const,
          simpleExplanation:
            "Your LDL ('bad') cholesterol is higher than ideal and worth discussing with your doctor.",
          detailedExplanation:
            "LDL cholesterol can build up in your arteries over time, increasing heart disease risk. At 142 mg/dL, it's above the optimal level of under 100. Your doctor may suggest dietary changes, more exercise, or in some cases medication to help lower it.",
        },
        {
          testName: "Good Cholesterol (HDL)",
          originalName: "HDL",
          value: "45 mg/dL",
          normalRange: ">40 mg/dL",
          status: "normal" as const,
          simpleExplanation:
            "Your HDL ('good') cholesterol is in the acceptable range.",
          detailedExplanation:
            "HDL cholesterol helps remove bad cholesterol from your arteries. At 45, you're above the minimum of 40, though higher is better. Exercise and healthy fats (like olive oil, nuts, and fish) can help boost this number.",
        },
        {
          testName: "Triglycerides",
          originalName: "Triglycerides",
          value: "140 mg/dL",
          normalRange: "<150 mg/dL",
          status: "normal" as const,
          simpleExplanation:
            "Your triglycerides are within the normal range.",
          detailedExplanation:
            "Triglycerides are a type of fat in your blood. At 140, you're just under the threshold of 150, which is good. Keeping sugar and refined carbs low will help keep this number healthy.",
        },
      ],
    },
    {
      category: "Thyroid",
      sectionName: "Thyroid Function",
      items: [
        {
          testName: "Thyroid Hormone (TSH)",
          originalName: "TSH",
          value: "2.1 mIU/L",
          normalRange: "0.4–4.0 mIU/L",
          status: "normal" as const,
          simpleExplanation:
            "Your thyroid is working normally.",
          detailedExplanation:
            "TSH (Thyroid Stimulating Hormone) shows how well your thyroid gland is functioning. At 2.1, you're right in the middle of the normal range, which means your thyroid is producing the right amount of hormones to regulate your metabolism, energy, and mood.",
        },
      ],
    },
  ],
  keyTakeaways: [
    "Your blood counts (CBC) are all perfectly normal — great news!",
    "Your LDL cholesterol is elevated at 142 mg/dL and should be discussed with your doctor.",
    "Your total cholesterol is borderline high at 215 mg/dL — manageable with lifestyle changes.",
    "Your thyroid function is completely normal.",
    "Overall, most of your results are healthy with just cholesterol needing attention.",
  ],
  questionsForDoctor: [
    "My LDL cholesterol is 142 — should I make dietary changes or consider medication?",
    "How often should I recheck my cholesterol levels?",
    "Are there specific foods or exercises you recommend to lower my LDL?",
    "Given my overall results, is there anything else I should be screened for?",
  ],
  actionItems: [
    "Increase intake of fiber-rich foods like oats, beans, and vegetables.",
    "Aim for 30 minutes of moderate exercise most days of the week.",
    "Reduce saturated fats from red meat and full-fat dairy products.",
    "Schedule a follow-up cholesterol check in 3–6 months.",
  ],
};
