# How Long Is The Line?
#### Where the world goes to see how long the line is.

<details>
  <summary>Running locally</summary>
<p>

#### Install Meteor   
```
curl https://install.meteor.com/ | sh
```

#### Clone repository    
```
git clone https://github.com/gazhayes/howlongistheline.org.git
```

Note: if you want to edit things and send a pull request you should _fork_ this project on Github first and clone _your_ fork instead of https://github.com/gazhayes/howlongistheline.org.git.

#### Install Dependencies   
```
meteor npm install
```

#### Run meteor
meteor run

#### Insert the database if running locally (never for production)
Run this from within the project directory while Meteor is running (it must be running to serve the local MongoDB instance):
```
cd ..
tar -xvf howlongistheline.org/mongodump.tar.gz
mongorestore -h 127.0.0.1 --port 3001 -d meteor dump/meteor
```   
(You will need [Mongo](https://docs.mongodb.com/manual/installation/) to be installed on your system).

If you already have the database but want to update it to the latest version, do a `meteor reset` from within the project directory before running the above, otherwise you will recieve `duplicate key error` errors.

#### Mongo errors   
If Mongo exists with status 1:
Quick fix: `export LC_ALL=C`   
Proper fix: something is wrong with your OS locales, good luck.

#### Meteor errors
If you do a `git pull` and Meteor doesn't start, the first thing to do is run `meteor npm install` as there may be package updates.

</p>
</details>    


## Contributing to howlongistheline    
A cardinal sin that many open source developers make is to place themselves above others. "I founded this project thus my intellect is superior to that of others". It's immodest and rude, and usually inaccurate. The contribution policy we use at howlongistheline applies equally to everyone, without distinction.    

The contribution policy we follow is the [Collective Code Construction Contract (C4)](http://socialarchitecture.science/c4/)    

If you're wondering why any of the rules in the C4 are there, take a look at the [line by line explanation](http://socialarchitecture.science/c4-deep/) of everything in the C4, this explains the rationale and history behind everything in the protocol and makes it easier to understand.

<details>
  <summary>Step-by-step guide to sending a pull request</summary>
<p>

0. Read the [contribution protocol](http://socialarchitecture.science/c4/) and the [line by line explanation](http://socialarchitecture.science/c4-deep/) of the protocol.
1. Fork this github repository under your own github account.
2. Clone _your_ fork locally on your development machine.
3. Choose _one_ problem to solve. If you aren't solving a problem that's already in the issue tracker you should describe the problem there (and your idea of the solution) first to see if anyone else has something to say about it (maybe someone is already working on a solution, or maybe you're doing somthing wrong).

**It is important to claim the issue you want to work on so that others don't work on the same thing. Make a comment in the issue: `I'm claiming this issue` before you start working on the issue, even if it is your own.**

If at some point you want to abandon the issue and let someone else have a go, let people know by commenting on the issue.

4. Add the howlongistheline repository as an upstream source and pull any changes:
```
@: git remote add upstream git://github.com/gazhayes/howlongistheline //only needs to be done once
@: git checkout master //just to make sure you're on the correct branch
@: git pull upstream master //this grabs any code that has changed, you want to be working on the latest 'version'
@: git push //update your remote fork with the changes you just pulled from upstream master
```
5. Create a local branch on your machine `git checkout -b branch_name` (it's usually a good idea to call the branch something that describes the problem you are solving). _Never_ develop on the `master` branch, as the `master` branch is exclusively used to accept incoming changes from `upstream:master` and you'll run into problems if you try to use it for anything else.
6. Solve the problem in the absolute most simple and fastest possible way with the smallest number of changes humanly possible. Tell other people what you're doing by putting _very clear and descriptive comments in your code every 2-3 lines_.    
Add your name to the AUTHORS file so that you become a part owner of howlongistheline.    
7. Commit your changes to your own fork:
Before you commit changes, you should check if you are working on the latest version (again). Go to the github website and open _your_ fork of howlongistheline, it should say _This branch is even with howlongistheline:master._    
If **not**, you need to pull the latest changes from the upstream howlongistheline repository and replay your changes on top of the latest version:
```
@: git stash //save your work locally
@: git checkout master
@: git pull upstream master
@: git push
@: git checkout -b branch_name_stash
@: git stash pop //this will _replay_ your work on the new local branch which is now fully up to date with the howlongistheline repository
```

Note: after running `git stash pop` you should run Meteor and look over your code again and check that everything still works as sometimes a file you worked on was changed in the meantime.

Now you can add your changes:   
```
@: git add changed_file.js //repeat for each file you changed. If you use -A to add everything, make sure you have your IDE stuff and local linting config etc in .gitignore, we don't want that in the repo.
```

And then commit your changes:
```
@: git commit -m 'problem: <70 characters describing the problem //do not close the '', press ENTER two (2) times
>
>solution: short description of how you solved the problem.' //Now you can close the ''. Be sure to mention the issue number if there is one (e.g. #6)    
@: git push //this will send your changes to _your_ fork on Github
```    
8. Go to your fork on Github and select the branch you just worked on. Click "pull request" to send a pull request back to the master branch of the howlongistheline repository.
9. Send the pull request, be sure to mention the issue number with a # symbol at the front (e.g. #1014).  
10. Go back to the issue, and make a comment:
  ```
    Done in #(PR_NUMBER)
  ```
  
  Your change will be pushed to production, usually within a few hours. Everyone can then test your solution and whoever opened the issue can close it if it solves the problem.

#### What happens after I send a pull request?    
If your pull request contains a correct patch (read the C4) a maintainer will merge it.
If you want to work on another problem while you are waiting for it to merge simply repeat the above steps starting at:
```
@: git checkout master
```

#### Tests
Tests are not yet implemented, feel free to add tests if you wish. This will prevent others from breaking your changes later.

</p>
</details>    


## License
The license and contribution policy are two halves of the same puzzle. This project is licensed under the [MPL v2.0 license](LICENSE). The code is owned (and Copyright) by _all_ contributors. Contributors are listed in the [AUTHORS](AUTHORS) file. Please add your name to the end of this file in your first pull request so that you also become an owner.

This license ensures that:
1. Contributors to howlongistheline cannot have their code stolen and used by closed-source projects without their permission. It's very common for corporate software merchants to steal code from open source projects and use it in their closed source or even patented products and services in direct competition with the original project. For example, anyone who contributes code to a project released under a BSD/MIT style license effectively has no rights to their own code or any improvements made upon it.
2. Anyone using any code from howlongistheline must also share their work under a _share-alike_ license so that anyone else can use their improvements.
3. No one can change the above, without explicit written permission from _all_ contributors, which is practically impossible to get. That means even the founder of this project cannot ever relicense and sell howlongistheline or its code. It belongs to everyone who contributed to it (and it always will).

It is not permissible to use _any_ code from this codebase in _anything_ that isn't using a _share-alike_ license. Violations of the license will absolutely not be tolerated, and the terms of this license will be enforced through a variety of _very_ creative methods leaving the perpetrator in a state of deep regret.
