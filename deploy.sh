#!/bin/bash
git checkout live
git merge master
git push origin live
git checkout master
ssh edu '/var/www/webhooks/testseries.sh '$1
