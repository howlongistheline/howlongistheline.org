#! /bin/bash
#exec 3>&1 4>&2
#trap 'exec 2>&4 1>&3' 0 1 2 3
#exec 1>log.out 2>&1
cd ~/temp
rm newhead.txt
if [ -d ~/temp/howlongistheline.org ]
then
    cd /home/gareth/temp/howlongistheline.org
    echo "Fetching current HEAD sha1"
    CURRENTHEAD=$(git rev-parse --verify HEAD)
    # github API sometimes times out, so we use git clone which is more resilient.
    echo "Attempting to pull latest commits from Github..."
    cd ..
    rm -rf howlongistheline.org
    git clone https://github.com/howlongistheline/howlongistheline.org.git
    cd howlongistheline.org
    NEWHEAD=$(git rev-parse --verify HEAD)
else
    echo "howlongistheline.org directory doesn't exist, pulling from Github..."
    CURRENTHEAD=false
    git clone https://github.com/howlongistheline/howlongistheline.org.git
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
cd ~/temp/howlongistheline.org
( meteor npm install ) & pid=$!
( sleep 300s && kill -HUP $pid ) 2>/dev/null & watcher=$!
if wait $pid 2>/dev/null
then
   pkill -HUP -P $watcher
   wait $watcher
else
   echo "else 7"
   exit 1;
fi

cd ~/temp/howlongistheline.org
#meteor npm remove caniuse-lite --save
#rm -rf node_modules/.bin
meteor npm update
npm prune --production
rm -rf ~/temp/howlongistheline.orgbundle
cd ~/temp/howlongistheline.org
ls ~/temp/howlongistheline.orgbundle
#VPS with small memory and no swap sometimes fails randomly, let's just keep building till she works.
while ! [ -d ~/temp/howlongistheline.orgbundle/bundle/programs/server ]
do
    meteor build --directory ~/temp/howlongistheline.orgbundle
done
cd ~/temp/howlongistheline.orgbundle/bundle/programs/server
npm install &> /home/gareth/npm.log
touch /home/gareth/npminstall.success
export MONGO_URL="replace with mongo url"
export PORT="9000"
export ROOT_URL="https://howlongistheline.org"
forever stop --killTree /home/gareth/howlongistheline.org/main.js &> /home/gareth/howlongistheline.orgforeverstop.log
rm -rf ~/howlongistheline.org
cp -R ~/temp/howlongistheline.orgbundle/bundle ~/howlongistheline.org
forever -p /home/gareth/forever start /home/gareth/howlongistheline.org/main.js &> /home/gareth/howlongistheline.orgforeverstart.log
echo "started howlongistheline.org instance"
exit 0;
