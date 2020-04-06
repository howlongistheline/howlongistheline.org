import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Card } from 'react-onsenui'

export default function learntocode({}) {
    return (
      <MainLayout>

      <div className="learntocode">
        <h1>YOU can learn to code!</h1>
      <Card>
        <div className="title">Why learn to code?</div>
        <p>Learning to code isn't just for people who want to become programmers. Being able to create software to solve problems around you helps make the world a better place, and makes you more valuable to those around you no matter what your job is. But the most important reason is that it's fun!</p>
      </Card>

      <Card>
        <div className="title">Can this project help me?</div>
        <p>When you're learning to code, it's good to have project to work so that what you learn has an immediate impact.</p>
        <p>This site was intentionally created with language and framework that is easy for new programmers to learn. If you start learning to code right now, you'll be able to start making minor improvements to this site within a few hours! Within a week or so, you'll be able to add entirely new features!</p>
      </Card>

      <Card>
        <div className="title">How do I get started?</div>
        <p>The first thing you'll want to do is learn Javascript. This is the language used by most web applications today. Here is a <a href="https://www.codecademy.com/learn/introduction-to-javascript">great introductory course</a> that you can take right now for free.</p>
        <p>Once you've finished that course, or if you already know JavaScript, take <a href="https://www.meteor.com/tutorials/react/creating-an-app">this tutorial</a> if you'd like to improve this site.</p>
        <p>Finally, go to the <a href="https://github.com/howlongistheline/howlongistheline.org">Github Repository</a> for this site and follow the instructions in the Readme file!</p>
      </Card>
      </div>
      </MainLayout>
    )
}
