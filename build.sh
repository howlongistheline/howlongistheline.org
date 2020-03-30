#! /bin/bash
cd ~/temp
rm newhead.txt
if [ -d ~/temp/howlongistheline.org ]
then
    cd /home/gareth/temp/howlongistheline.org
    echo "Fetching current HEAD sha1"
    CURRENTHEAD=$(git rev-parse --verify HEAD)
    # github API sometimes times out, so we use git clone which is more resiliant.
    echo "Attempting to pull latest commits from Github..."
    cd ..
    rm -rf ]
    git clone https://github.com/gazhayes/howlongistheline.org.git
    cd howlongistheline.org
    NEWHEAD=$(git rev-parse --verify HEAD)
else
    echo "howlongistheline.org directory doesn't exist, pulling from Github..."
    CURRENTHEAD=false
    git clone https://github.com/gazhayes/howlongistheline.org.git
    cd /home/gareth/temp/howlongistheline.org
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
if ! [ -d ~/temp/howlongistheline.org ]
then
    touch nohowlongistheline.orgdir.problem
    echo "No howlongistheline.org directory!"
    exit 1;
fi
cd ~/temp
cd howlongistheline.org
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
/usr/local/bin/meteor build --directory ~/temp/howlongistheline.orgbundle
if ! [ -d ~/temp/howlongistheline.orgbundle/bundle/programs/server ]
then
    echo "else 8"
    exit 1;
fi
cd ~/temp/howlongistheline.orgbundle/bundle/programs/server
/usr/bin/npm install &> /home/gareth/npm.log
touch /home/gareth/npminstall.success
export MONGO_URL=mongodb://UPDATE
export PORT=9000
export ROOT_URL=http://howlongistheline.org
/usr/local/bin/forever stop /home/gareth/howlongistheline.org/main.js &> /home/gareth/howlongistheline.orgforeverstop.log
rm -rf ~/howlongistheline.org
cp -R ~/temp/howlongistheline.orgbundle/bundle ~/howlongistheline.org
/usr/local/bin/forever start /home/gareth/howlongistheline.org/main.js &> /home/gareth/howlongistheline.orgforeverstart.log
echo "started howlongistheline.org instance"

exit 0;
