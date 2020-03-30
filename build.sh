#! /bin/bash
cd ~/temp
rm newhead.txt
if [ -d ~/temp/howlongistheline ]
then
    cd /home/gareth/temp/howlongistheline
    echo "Fetching current HEAD sha1"
    CURRENTHEAD=$(git rev-parse --verify HEAD)
    # github API sometimes times out, so we use git clone which is more resiliant.
    echo "Attempting to pull latest commits from Github..."
    cd ..
    rm -rf howlongistheline
    git clone https://github.com/gazhayes/howlongistheline.git
    cd howlongistheline
    NEWHEAD=$(git rev-parse --verify HEAD)
else
    echo "howlongistheline directory doesn't exist, pulling from Github..."
    CURRENTHEAD=false
    git clone https://github.com/gazhayes/howlongistheline.git
    cd /home/gareth/temp/howlongistheline
    NEWHEAD=$(git rev-parse --verify HEAD)
fi
echo "CURRENT HEAD: $CURRENTHEAD"
echo "NEW HEAD: $NEWHEAD"
if [ "$CURRENTHEAD" == "$NEWHEAD" ]
then
    echo "No updated needed"
    exit 0;
fi
if ! [[ "$NEWHEAD" =~ ........................................ ]]
then
    touch gitpull.problem
    echo "Ruh Roh, something went wrong with git pull"
    exit 1;
fi
cd ~/temp
if ! [ -d ~/temp/howlongistheline ]
then
    touch nohowlongisthelinedir.problem
    echo "No howlongistheline directory!"
    exit 1;
fi
cd ~/temp
cd howlongistheline
( /usr/bin/npm install ) & pid=$!
( sleep 300s && kill -HUP $pid ) 2>/dev/null & watcher=$!
if wait $pid 2>/dev/null
then
    pkill -HUP -P $watcher
    wait $watcher
else
    echo "else 7"
    exit 1;
fi
rm -rf node_modules/.bin
/usr/bin/npm prune --production
/usr/local/bin/meteor build --directory ~/temp/howlongisthelinebundle
if ! [ -d ~/temp/howlongisthelinebundle/bundle/programs/server ]
then
    echo "else 8"
    exit 1;
fi
cd ~/temp/howlongisthelinebundle/bundle/programs/server
/usr/bin/npm install &> /home/gareth/npm.log
touch /home/gareth/npminstall.success
export MONGO_URL=mongodb://UPDATE
export PORT=9000
export ROOT_URL=http://howlongistheline.org
/usr/bin/forever stop /home/gareth/howlongistheline/main.js &> /home/gareth/howlongisthelineforeverstop.log
rm -rf ~/howlongistheline
cp -R ~/temp/howlongisthelinebundle/bundle ~/howlongistheline
/usr/bin/forever start /home/gareth/howlongistheline/main.js &> /home/gareth/howlongisthelineforeverstart.log
echo "started howlongistheline instance"

exit 0;
