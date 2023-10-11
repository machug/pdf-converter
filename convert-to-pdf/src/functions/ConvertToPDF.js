const { app } = require("@azure/functions");
const puppeteer = require("puppeteer");

app.http("ConvertToPDF", {
  methods: ["POST"],
  handler: async (req, context) => {

    context.log("Request method:", req.method);

    // extract JSON payload from body
    const body = await req.json();

    context.log("Body:", body);

    // Check if the request body contains HTML content
    if (!body || !body.html) {
      return {
        status: 400,
        body: "HTML content is missing in the request body.",
      };
    }

    // Log the received request headers and body for debugging
    const htmlContent = body.html;
    context.log("HTML content received.");
    context.log("Starting conversion process...");

    try {
      // Create a browser instance and open a new page
      context.log("Launching browser...");
      const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: '/usr/local/bin/chromium/chrome',
        args: ['--no-sandbox']
      });

      // Check if the browser instance was created successfully
      if (!browser) {
        context.log("Browser instance not created.");
        return {
          status: 500,
          body: "Error creating browser instance.",
        };
      }

      const page = await browser.newPage();
      context.log("Browser launched.");

      // Set HTML content to the page
      await page.setContent(htmlContent);
      context.log("HTML content loaded.");

      // Print the page as a PDF
      const pdfBuffer = await page.pdf({ format: "A4" });

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
