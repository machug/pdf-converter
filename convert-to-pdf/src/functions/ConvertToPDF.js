const { app } = require("@azure/functions");
const puppeteer = require("puppeteer");

app.http("ConvertToPDF", {
  methods: ["POST"],
  handler: async (req, context) => {
    context.log("Starting conversion process...");

    // Log the received request headers and body for debugging
    context.log("Headers:", JSON.stringify(req.headers));
    context.log("Body:", JSON.stringify(req.body));

    if (req.body && req.body.html) {
      const htmlContent = req.body.html;
      context.log("HTML content received.");

      try {
        // Create a browser instance and open a new page
        context.log("Launching browser...");
        const browser = await puppeteer.launch({
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
          ],
        });

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
    } else {
      return {
        status: 400,
        body: "Please provide HTML in the request body.",
      };
    }
  },
});
