
const jsPsych = initJsPsych({
  on_finish: () => {
    jsPsych.data.displayData("csv");
  }
});

const subject_id = jsPsych.randomization.randomID(10);
const filename = `${subject_id}.csv`;

const save_data = {
                type: jsPsychPipe,
                action: "save",
                experiment_id: "aytF4pjDilZI",
                filename: filename,
                data_string: ()=>jsPsych.data.get().csv()
              };

// -------------------- PARAMETERS --------------------
const N_PER_CELL = 3;                 // x per each of 4 types
const COMPREHENSION_RATE = 0.30;      // “every once in a while”
const HIGH_LOAD_N_DIGITS = 6;         // number length for high load
const LOW_LOAD_N_DIGITS = 0;          // low load: no number screen
const FIXATION_MS = 300;

// -------------------- HELPERS --------------------
function makeDigits(n) {
  // string of n random digits, no spaces
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function sampleWithoutReplacement(arr, n) {
  return jsPsych.randomization.sampleWithoutReplacement(arr, n);
}

function shuffle(arr) {
  return jsPsych.randomization.shuffle(arr);
}

function coinFlip(pTrue = 0.5) {
  return Math.random() < pTrue;
}

// Build trial objects for one cell, ensuring unique items overall
function pickTrialsForCell(remainingItems, cell, n) {
  const picked = sampleWithoutReplacement(remainingItems, n);

  // remove picked from remaining
  const pickedSet = new Set(picked.map(x => `${x.short_word}||${x.long_word}`));
  const newRemaining = remainingItems.filter(
    x => !pickedSet.has(`${x.short_word}||${x.long_word}`)
  );

  const trials = picked.map(item => {
    const contextText = cell.context === "supportive"
      ? item.supportive_context
      : item.neutral_context;

    // randomize option order + key mapping
    // F = left option, J = right option
    const flip = coinFlip(0.5);
    const left = flip ? item.long_word : item.short_word;
    const right = flip ? item.short_word : item.long_word;

    const correct_load_answer = (cell.load === "high")
      ? makeDigits(HIGH_LOAD_N_DIGITS)
      : null;

    return {
      trial_kind: "completion",
      context: cell.context,            // supportive / neutral
      load: cell.load,                  // high / low
      short_word: item.short_word,
      long_word: item.long_word,
      sentence: contextText,
      left_option: left,
      right_option: right,
      options_flipped: flip,
      comprehension_question: item.comprehension_question || "",
      ask_comprehension: coinFlip(COMPREHENSION_RATE),
      load_number: correct_load_answer
    };
  });

  return { trials, remaining: newRemaining };
}

// -------------------- SELECT & ASSIGN STIMULI --------------------
const CELLS = [
  { context: "supportive", load: "low"  },
  { context: "neutral",    load: "low"  },
  { context: "supportive", load: "high" },
  { context: "neutral",    load: "high" }
];

let remaining = [...STIMULI];
let selectedTrials = [];

for (const cell of CELLS) {
  const out = pickTrialsForCell(remaining, cell, N_PER_CELL);
  selectedTrials.push(...out.trials);
  remaining = out.remaining;
}

selectedTrials = shuffle(selectedTrials); // fully random order

// -------------------- TRIAL DEFINITIONS --------------------
const welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="max-width: 800px;">
      <h2>Welcome</h2>
      <p>You will read a sentence and choose which completion sounds more natural.</p>
      <p>Press <strong>F</strong> for the left option, <strong>J</strong> for the right option.</p>
      <p>On some trials, you will briefly see a number and will later be asked to type it.</p>
      <p>Press <strong>Space</strong> to begin.</p>
    </div>
  `,
  choices: [" "]
};

const fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<p style="font-size:40px;">+</p>`,
  choices: "NO_KEYS",
  trial_duration: FIXATION_MS,
  data: { task: "fixation" }
};

// Number screen for high-load trials only
const load_number_screen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    const t = jsPsych.evaluateTimelineVariable("t");
    return `
      <div style="max-width: 900px;">
      <p>Memorize this number.</p>
        <div style="font-size: 48px; font-weight: 700;">${t.load_number}</div>
        
      </div>
    `;
  },
  choices: "NO_KEYS",
  trial_duration: 2500,
  data: () => {
    const t = jsPsych.evaluateTimelineVariable("t");
    return {
      task: "load_number",
      context: t.context,
      load: t.load,
      load_number: t.load_number,
      short_word: t.short_word,
      long_word: t.long_word
    };
  },
  
};

const load_number_high_load_only = {
    timeline: [load_number_screen],
    conditional_function: () => {
      const t = jsPsych.evaluateTimelineVariable("t");
      return t.load === "high" && t.load_number != null;
    }
  };
// Main forced-choice completion
const completion_trial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    const t = jsPsych.evaluateTimelineVariable("t");
    return `
      <div style="max-width: 900px;">
        <p style="margin:0 0 12px; font-size: 14px; color: #1a5fb4; font-weight: 500;">What sounds more natural?</p>
        <p style="font-size: 26px; line-height: 1.35;">${t.sentence}</p>
        <div style="display:flex; justify-content:space-between; gap: 30px; margin-top: 25px;">
          <div style="flex:1; border:1px solid #ccc; padding:16px; border-radius:10px;">
            <p style="margin:0; font-size: 18px; color:#666;"><strong>F</strong></p>
            <p style="margin:8px 0 0; font-size: 28px;"><strong>${t.left_option}</strong></p>
          </div>
          <div style="flex:1; border:1px solid #ccc; padding:16px; border-radius:10px;">
            <p style="margin:0; font-size: 18px; color:#666;"><strong>J</strong></p>
            <p style="margin:8px 0 0; font-size: 28px;"><strong>${t.right_option}</strong></p>
          </div>
        </div>
      </div>
    `;
  },
  choices: ["f", "j"],
  data: () => {
    const t = jsPsych.evaluateTimelineVariable("t");
    return {
      task: "completion",
      context: t.context,
      load: t.load,
      short_word: t.short_word,
      long_word: t.long_word,
      sentence: t.sentence,
      left_option: t.left_option,
      right_option: t.right_option,
      options_flipped: t.options_flipped,
      load_number: t.load_number
    };
  },
  on_finish: (data) => {
    data.chosen_side = data.response === "f" ? "left" : "right";
    data.chosen_word = data.response === "f" ? data.left_option : data.right_option;
    data.chose_short = data.chosen_word === data.short_word;
    data.chose_long = data.chosen_word === data.long_word;
  }
};

// Number recall after main question (high-load only)
const load_recall = {
  type: jsPsychSurveyText,
  questions: [
    { prompt: "Type the number you saw and press ENTER", name: "recall", required: true }
  ],
  data: () => {
    const t = jsPsych.evaluateTimelineVariable("t");
    return {
      task: "load_recall",
      context: t.context,
      load: t.load,
      load_number: t.load_number,
      short_word: t.short_word,
      long_word: t.long_word
    };
  },
  on_finish: (data) => {
    const t = jsPsych.evaluateTimelineVariable("t");
    const resp = data.response?.recall ?? "";
    data.recalled_number = String(resp).trim();
    data.load_correct = data.recalled_number === String(t.load_number);
  },

};

const load_recall_high_load_only = {
    timeline: [load_recall],
    conditional_function: () => {
      const t = jsPsych.evaluateTimelineVariable("t");
      return t.load === "high" && t.load_number != null;
    }
  };
// Comprehension question (optional per trial)
const comprehension_trial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    const t = jsPsych.evaluateTimelineVariable("t");
    return `
      <div style="max-width: 900px;">
        <p style="font-size: 24px;">${t.comprehension_question}</p>
        <p style="font-size: 16px; color: #666;">
          <strong>F</strong> = Yes &nbsp;&nbsp;&nbsp; <strong>J</strong> = No
        </p>
      </div>
    `;
  },
  choices: ["f", "j"],
  data: () => {
    const t = jsPsych.evaluateTimelineVariable("t");
    return {
      task: "comprehension",
      context: t.context,
      load: t.load,
      short_word: t.short_word,
      long_word: t.long_word,
      comprehension_question: t.comprehension_question
    };
  },
  on_finish: (data) => {
    data.comp_answer = data.response === "f" ? "yes" : "no";
  },

};
const comprehension_if_flagged = {
    timeline: [comprehension_trial],
    conditional_function: () => {
      const t = jsPsych.evaluateTimelineVariable("t");
      return (
        t.ask_comprehension &&
        String(t.comprehension_question || "").trim().length > 0
      );
    }
  };
// -------------------- TIMELINE --------------------
const trial_procedure = {
  timeline: [
        fixation,
        load_number_high_load_only,
        completion_trial,
        load_recall_high_load_only,
        comprehension_if_flagged
      ],
  timeline_variables: selectedTrials.map(t => ({ t })),
  randomize_order: true
};

const debrief = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    const n = jsPsych.data.get().filter({ task: "completion" }).count();
    const nHigh = jsPsych.data.get().filter({ task: "completion", load: "high" }).count();
    const recall = jsPsych.data.get().filter({ task: "load_recall" });
    const recallPct = recall.count()
      ? Math.round(100 * recall.filter({ load_correct: true }).count() / recall.count())
      : 0;
    return `
      <div style="max-width: 800px;">
        <h2>Done!</h2>
        <p>Thank you for your participation!</p>
        <p>Press <strong>Space</strong> to finish.</p>
      </div>
    `;
  },
  choices: [" "]
};

jsPsych.run([welcome, trial_procedure, debrief]);