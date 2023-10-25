FROM mcr.microsoft.com/azure-functions/node:4-node18

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install dependencies for Puppeteer and Chromium
RUN apt-get update && \
    apt-get install -y wget unzip fontconfig locales gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

# Copy function app files
COPY . /home/site/wwwroot

# Install app dependencies
RUN cd /home/site/wwwroot && \
    npm install

# Run chrome installer for puppeteer caching fix
RUN node /home/site/wwwroot/node_modules/puppeteer/install.mjs

# Tidy up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*