const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();
require('./heal');

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './datetime_test.js',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:3000',
      show: true
    },
    AI: {
    }
  },
  ai: {
    request: async (messages) => {
      const Groq = require('groq-sdk');
      const groq = new Groq({
        apiKey: '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'
      });
      const chatCompletion = await groq.chat.completions.create({
          messages,
          model: "mixtral-8x7b-32768",
      });
      return chatCompletion.choices[0]?.message?.content || "";
    }
  },
  include: {
    I: './steps_file.js'
  },
  name: 'AI_Test',
  plugins: {
    heal: {
      enabled: true
    }
  }
}