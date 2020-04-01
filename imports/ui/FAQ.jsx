import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Card } from 'react-onsenui'

export default function faq({}) {
    return (
      <MainLayout>

      <div className="FAQ">
        <h1>Frequently Asked Questions</h1>
      <Card>
        <div className="title">What is this for?</div>
        <p>I wanted to know how busy the line to get into the supermarket is before adding myself to the number of people congregating and potentially spreading the virus.</p>
      </Card>

      <Card>
        <div className="title">This looks like it's just for Dunedin. Can you do the same for Auckland?</div>
        <p>Sorry to hear that you are not in Dunedin, which most people agree is the best place to live.</p>
        <p>The good news is that you can add any shop to this site, whether it is in Dunedin, Auckland, or even Sydney, or New York! This site will automatically detect your location and tell you what the closest shops are, and how long the line is. To add a shop, simply tap on the <a href="addLine">Add New Shop</a> button at the bottom of the page.</p>
      </Card>

      <Card>
        <div className="title">Can I change the status if I'm at the shop and the status is <i>different?</i></div>
        <p>Absolutely! Please do. When you are at a shop, tap the "Change line status now" button. You will then be able to change the status, and everyone who visits the site will see that change <i>immediately</i>.</p>
        <p>By updating the status, YOU are helping to "flatten the curve" by allowing people to stay home when a shop is busy, and to get their shopping when it's quiet.</p>
      </Card>

      <Card>
        <div className="title">I've got an idea to make this better, what should I do?</div>
        <p>Please leave a comment on the <a href="/feedback">feedback</a> page if there's anything at all I can do to make this site more useful for you, or if you notice something wrong/broken.</p>
      </Card>

      <Card>
        <div className="title">I'm a developer and want to help, what can I do?</div>
        <p>This project is 100% open source and all contributions are welcome. The source code is on <a href="https://github.com/gazhayes/howlongistheline.org">Github</a> and pull requests are welcome!</p>
      </Card>

      <Card>
        <div className="title">I work at a supermarket, can I help?</div>
        <p>You're already doing a huge job by keeping essential services open, thank you! I hope this site helps reduce the peak volume of customers within your store.</p>
        <p>If you think this site is helpful, here are some ways you could help even more than you already are:</p>
        <ul>
        <li>If your store is not listed, please <a href="/addLine">add it</a>.</li>
        <li>Put a sign on the shop door with the site address (howlongistheline.org), asking people to update the line status.</li>
        <li>Tell your manager about this site, and if they think it's helpful they might want to let other stores know about it.</li>
        <li>Get in <a href="/feedback">contact</a> and let me know what I can do to make this site more useful for <i>you</i>, and what other problems I might be able to solve for <i>you</i> during this difficult period.</li>
        </ul>

      </Card>
          
           <Card>
        <div className="title">Who are you?</div>
               <p><a href="https://www.facebook.com/chancelloronbrinkofsecondbailoutforbanks">https://www.facebook.com/chancelloronbrinkofsecondbailoutforbanks</a></p>
               <p><a href="https://github.com/gazhayes">https://github.com/gazhayes</a></p>
               <p><a href="http://socialarchitecture.science/">http://socialarchitecture.science/</a>

      </Card>
          
      </div>
      </MainLayout>
    )
}
