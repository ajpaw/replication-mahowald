var jsPsych = initJsPsych({
  show_progress_bar: true,
  message_progress_bar: "SESSION PROGRESS",
  auto_update_progress_bar: false,

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
const N_PER_CELL = 5;                 // x per each of 4 types
const COMPREHENSION_RATE = 0.2;      // 0.2 “every once in a while”
const HIGH_LOAD_N_DIGITS = 6;         // number length for high load
const LOW_LOAD_N_DIGITS = 0;          // low load: no number screen
const FIXATION_MS = 300;
const TOTAL_TRIALS = 4 * N_PER_CELL + 2;

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

/** Random question picked from CHECKS (longshort-stims.js); F = true, J = false. */
function sampleComprehensionCheck() {
  const row = jsPsych.randomization.sampleWithReplacement(CHECKS, 1)[0];
  const key = String(row.correct_answer ?? row.answer ?? "")
    .trim()
    .toLowerCase();
  return { question: row.question, correct_key: key };
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

    const ask_comprehension = coinFlip(COMPREHENSION_RATE);
    let comp_check_question = "";
    let comp_check_correct_key = "";
    if (ask_comprehension && Array.isArray(CHECKS) && CHECKS.length) {
      const check = sampleComprehensionCheck();
      comp_check_question = check.question;
      comp_check_correct_key = check.correct_key;
    }

    return {
        trial_kind: "completion",
        context: cell.context,
        load: cell.load,
        short_word: item.short_word,
        long_word: item.long_word,
        sentence: contextText,
        left_option: left,
        right_option: right,
        options_flipped: flip,
        ask_comprehension,
        comp_check_question,
        comp_check_correct_key,
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

// -------------------- PRACTICE (1-time tutorial) --------------------
const practiceItem = PRACTICE_QUESTION?.[0];
const practiceFlip = coinFlip(0.5);

function buildPracticeTrial(loadType) {
  const flip = practiceFlip;
  const left = flip ? practiceItem.long_word : practiceItem.short_word;
  const right = flip ? practiceItem.short_word : practiceItem.long_word;

  return {
    trial_kind: "practice_completion",
    context: "supportive", // use supportive sentence for practice
    load: loadType,        // "low" then "high"
    short_word: practiceItem.short_word,
    long_word: practiceItem.long_word,
    sentence: practiceItem.supportive_context,
    left_option: left,
    right_option: right,
    options_flipped: flip,
    ask_comprehension: false,      // no comprehension in tutorial
    comp_check_question: "",
    comp_check_correct_key: "",
    load_number: loadType === "high" ? makeDigits(HIGH_LOAD_N_DIGITS) : null
  };
}

const practiceTrials = practiceItem
  ? [buildPracticeTrial("low"), buildPracticeTrial("high")]
  : [];

const practice_intro = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="max-width: 800px;">
      <h2>Practice</h2>
      <p>You will now do 2 short practice trials. For this practice round, both trials will use the same sentence.</p>
      <p>Press <strong>Space</strong> to start practice.</p>
    </div>
  `,
  choices: [" "]
};



const practice_to_main = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="max-width: 800px;">
      <h2 style="color: #1a5fb4;">Practice Complete</h2>
      <p>You are now starting the actual experiment.</p>
      <p>Press <strong>Space</strong> to continue.</p>
    </div>
  `,
  choices: [" "]
};


// -------------------- TRIAL DEFINITIONS --------------------
const welcomeScreen = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div class="instructions">
      <h2>Welcome</h2>
      <p>Thank you for your interest in this experiment! This should take about 8 minutes.</p>
      <p>This study will ask you to perform tasks involving reading short sentences.</p>

      <div class="consent">
        <p>
          By clicking below, you are agreeing to take part in a study being conducted at Stanford University.
        </p>
        <ul>
          <li>You must be at least 18 years old to participate.</li>
          <li>Your participation is voluntary.</li>
          <li>You may choose to stop the study at any time without penalty.</li>
          <li>Your responses are fully anonymous and will be analyzed only in aggregate form.</li>
        </ul>
      </div>
      <p>Do you consent to participate in this study as described above?</p>
    </div>
  `,
  choices: ['Yes, I agree to participate'],
  margin_vertical: '30px',
  data: { task: 'consent' },
  on_start: function () {
    jsPsych.progressBar.progress = 0;
  },
  on_finish: function () {
    var element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
  };

const instructionsScreen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div class="instructions">
      <h2>Instructions</h2>
      <p>You will see a sentence with two possible endings shown side by side. You will pick a completion that sounds most natural to YOU (there is no right answer!)</p>
      <p>Press <strong>F</strong> for the left option, <strong>J</strong> for the right option.</p>
      <p>(1) On <strong>some</strong> trials you will briefly see a number that you will need to memorize; later you will be asked to recall it.</p>
      <p>(2) On other trials you will simply answer the question.</p>
      <p>Coming up, is some practice.</p>
      <p>Press SPACE to continue.</p>
    </div>
  `,
  choices: [" "],
  data: { task: "instructions" }
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
        <p style="margin:0 0 12px; font-size: 18px; color: #1a5fb4; font-weight: 500;">What sounds more natural?</p>
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
    jsPsych.progressBar.progress =  jsPsych.progressBar.progress + (1/TOTAL_TRIALS);
  }
};

// Number recall after main question (high-load only)
const load_recall = {
  type: jsPsychSurveyText,
  questions: [
    { prompt: "Type in the number you saw earlier", name: "recall", required: true }
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

// Comprehension check (drawn from CHECKS in longshort-stims.js when flagged)
const comprehension_trial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    const t = jsPsych.evaluateTimelineVariable("t");
    return `
      <div style="max-width: 900px;">
        <p style="margin:0 0 12px; font-size: 18px; color: #1a5fb4; font-weight: 500;">
          True or false?
        </p>
        <p style="font-size: 26px; line-height: 1.35;">${t.comp_check_question}</p>
        <div style="display:flex; justify-content:space-between; gap: 30px; margin-top: 25px;">
          <div style="flex:1; border:1px solid #ccc; padding:16px; border-radius:10px;">
            <p style="margin:0; font-size: 18px; color:#666;"><strong>F</strong></p>
            <p style="margin:8px 0 0; font-size: 28px;"><strong>True</strong></p>
          </div>
          <div style="flex:1; border:1px solid #ccc; padding:16px; border-radius:10px;">
            <p style="margin:0; font-size: 18px; color:#666;"><strong>J</strong></p>
            <p style="margin:8px 0 0; font-size: 28px;"><strong>False</strong></p>
          </div>
        </div>
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
      comp_check_question: t.comp_check_question,
      comp_check_correct_key: t.comp_check_correct_key
    };
  },
  on_finish: (data) => {
    const t = jsPsych.evaluateTimelineVariable("t");
    data.comp_answer = data.response === "f" ? "true" : "false";
    data.comprehension_correct =
      data.response === t.comp_check_correct_key;
  }
};
const comprehension_if_flagged = {
  timeline: [comprehension_trial],
  conditional_function: () => {
    const t = jsPsych.evaluateTimelineVariable("t");
    return (
      t.ask_comprehension &&
      String(t.comp_check_question || "").trim().length > 0 &&
      (t.comp_check_correct_key === "f" || t.comp_check_correct_key === "j")
    );
  }
};

let sentenceCounter = 0;

const separator = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    sentenceCounter+=1;
    var n = sentenceCounter;
    return `<div style="font-size:25px; font-weight:600;">
      Hit SPACE to move on to trial # ${n}!
    </div>`;
  },
  choices: [" "],
  //trial_duration: 2500,
  data: () => ({
    event: "separator",
    sent_num: jsPsych.timelineVariable('sent_num'),
    sentence: jsPsych.timelineVariable('t').sentence ?? null
  }),
  on_start: () => { document.body.style.backgroundColor = "#D6E8FF"; },
  on_finish: () => { document.body.style.backgroundColor = ""; }
};


const practice_separator = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    return `<div style="font-size:25px; font-weight:600;">
      Here is a type of task you might encounter  
    </div>`;
  },
  choices: "NO_KEYS",
  trial_duration: 3000,
  on_start: () => { document.body.style.backgroundColor = "#D6E8FF"; },
  on_finish: () => { document.body.style.backgroundColor = ""; }
};


// -------------------- TIMELINE --------------------
const practice_procedure = {
  timeline: [
    //fixation,
    practice_separator,
    load_number_high_load_only,
    completion_trial,
    load_recall_high_load_only
  ],
  timeline_variables: practiceTrials.map(t => ({ t })),
  randomize_order: false // forces low-load first, high-load second
};


const trial_procedure = {
  timeline: [
        //fixation,
        separator,
        load_number_high_load_only,
        completion_trial,
        load_recall_high_load_only,
        comprehension_if_flagged
      ],
  //timeline_variables: selectedTrials.map(t => ({ t })),
  timeline_variables: selectedTrials.map((t, i) => ({ t, sent_num: i + 1 })),
  randomize_order: true
};

const post_expt_survey = {
  type: jsPsychSurvey,
  survey_json:{
    showQuestionNumbers: false,
    elements: [
      {
        type: "text",
        name: "problems",
        title: "Any problems/overall thoughts on the experiment that you would like to share?",
        placeholder: "Enter here",
        required: false
      },
      {
        type: "text",
        name: "languages",
        title: "Do you speak any other languages (other than English) fluently?",
        placeholder: "Enter language(s) as comma separated values",
        required: false
      },
      {
        type: "radiogroup",
        name: "gender",
        title: "How do you describe your gender identity?",
        choices: ['Woman', 'Man', 'Trans Man', 'Trans Woman', 'Non-binary', 'Prefer not to say', 
        'None of the above'],
        required: false
      },
      {
        type: "radiogroup",
        name: "education",
        title: "What is the highest level of education you have completed (or are currently pursuing)?",
        choices: ['Middle school', 'High school', 'Vocational training', 'Bachelors', 'Associate', 'Masters', 'Doctorate','Professional degree' ,'Prefer not to say', 
        'None of the above'],
        required: false
      },
    ]
  }

}

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

jsPsych.run([welcomeScreen, instructionsScreen, practice_intro, practice_procedure, practice_to_main, trial_procedure, post_expt_survey, save_data,debrief]);