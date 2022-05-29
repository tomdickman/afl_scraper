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
   echo "      To be added"
   echo
}

while getopts ":h" option; do
   case $option in
      h) # display help
         help
         exit 0;;
   esac
done

npm run scrape
