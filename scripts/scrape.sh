#!/bin/bash

################################################################################
# Display help                                                                 #
################################################################################
help()
{
   echo "Usage:  scraper [OPTIONS] COMMAND"
   echo
   echo "An AFL web stats scraping utility using puppeteer"
   echo
   echo "options:"
   echo "h     Print this Help."
   echo
   echo "commands:"
   echo "p     Scrape current players"
   echo "s     Scrape round stats"
   echo
}

while getopts "ehps" option; do
   case $option in
      e) # export round stats to Dynamo DB
         echo "Exporting Round Stats"
         npm run exportRoundStats
         exit 0;;
      h) # display help
         help
         exit 0;;
      p) # scrape current players
         echo "Scraping Players"
         npm run scrapePlayers
         exit 0;;
      s) # scrape round stats
         echo "Scraping Round Stats"
         npm run scrapeRoundStats
         exit 0;;
      *) # display help
         help
         exit 1;;
   esac
done

# npm run scrape
echo "Invalid COMMAND"
exit 1
