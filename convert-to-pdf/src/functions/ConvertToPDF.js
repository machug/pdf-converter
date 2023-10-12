const { app } = require("@azure/functions");
const puppeteer = require("puppeteer");

const launchBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/local/bin/chromium/chrome',
    args: ['--no-sandbox']
  });
  return browser;
};

const createPage = async (browser, htmlContent) => {
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  return page;
};

const convertToPDF = async (page) => {
  const pdfBuffer = await page.pdf({ format: "A4" });
  return pdfBuffer;
};

app.http("ConvertToPDF", {
  methods: ["POST"],
  handler: async (req, context) => {
    context.log("Request method:", req.method);

    const body = await req.json();
    context.log("Body:", body);

    if (!body || !body.html) {
      return {
        status: 400,
        body: "HTML content is missing in the request body.",
      };
    }

    const htmlContent = body.html;
    context.log("HTML content received.");
    context.log("Starting conversion process...");

    try {
      context.log("Launching browser...");
      const browser = await launchBrowser();

      if (!browser) {
        context.log("Browser instance not created.");
        return {
          status: 500,
          body: "Error creating browser instance.",
        };
      }

      const page = await createPage(browser, htmlContent);
      context.log("HTML content loaded.");

      const pdfBuffer = await convertToPDF(page);

      await browser.close();
      context.log("Browser closed.");

      return {
        status: 200,
        body: pdfBuffer,
        headers: {
          "Content-Type": "application/pdf",
        },
      };
    } catch (error) {
      context.log("Error Message:", error.message);
      context.log("Error Stack:", error.stack);
      return {
        status: 500,
        body: "Error converting HTML to PDF: " + JSON.stringify(error),
      };
    }
  },
});