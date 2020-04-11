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
        <div className="title">This looks like it's just for New Zealand. Can you do the same for other countries?</div>
        <p>You can add any shop to this site, no matter where it is. If your local stores are not listed, simply add them and ask you local community to update the numbers when they visit the store.</p>
      </Card>

      <Card>
        <div className="title">I've got an idea to make this better, what should I do?</div>
        <p>If you're a developer, send a pull request to the <a href="https://github.com/howlongistheline/howlongistheline.org">Github</a> repository. If you're not a developer, you can still browse through the list of issues we are working on and features we are adding. You may also want to look at the <a href="https://www.facebook.com/groups/1161156860891990/">Facebook group</a>.</p>
      </Card>

      <Card>
        <div className="title">I work at a supermarket, can I help?</div>
        <p>You're already doing a huge job by keeping essential services open, thank you! I hope this site helps reduce the peak volume of customers within your store.</p>
        <p>If you think this site is helpful, here are some ways you could help even more than you already are:</p>
        <ul>
        <li>If your store is not listed, please <a href="/addLine">add it</a>.</li>
        <li>Print <a href="https://www.dropbox.com/s/n3fh33wywy7op21/howlongistheline.pdf?dl=1">this sign</a> and put it in the front door of the store. </li>
        <li>Tell your manager about this site, and if they think it's helpful they might want to let other stores know about it.</li>
        <li>Get in <a href="/feedback">contact</a> and let me know what I can do to make this site more useful for <i>you</i>, and what other problems I might be able to solve for <i>you</i> during this difficult period.</li>
        </ul>

      </Card>

       <Card>
        <div className="title">Why do I have to physically be at the store when adding it to the site?</div>
        <p>This site relies on the coordinates provided by your phone. When you add a new store, it will use your current location as the store's location. When someone else updates the status of a line, it will check that they are really at the same location.</p>
        <p>There are some other ways around this problem, but none of them are free and they all provide tracking data to third parties. I would like to avoid this exposing your information to third parties.</p>
      </Card>

           <Card>
        <div className="title">Who are you?</div>
        <p>This project is released under the <a href="https://github.com/howlongistheline/howlongistheline.org/blob/master/LICENSE">Mozilla Public License v2.0</a> and owned by everyone (and anyone) who contributes to the codebase. That list can be seen <a href="https://github.com/howlongistheline/howlongistheline.org/blob/master/AUTHORS">here</a>.</p>
        <p>This license ensures that Contributors to this project cannot have their code stolen and used against them. It's very common for corporate interests to take code from open source projects licensed under BSD/MIT style licenses and use it in their closed source or even patented products and services, often in direct competition to the original project. This is a poorly understood concept in the software development community. This type of license also legally binds anyone using any code from this project to also share their derivative work under this share-alike type of license, so that other people can continue to benefit from their work the same way the business interest is benefitting from ours. Even the founders of this project cannot legally sell this project without unanimous agreement from all involved. It belongs to everyone who contributes to it along the way.</p>
      </Card>

      </div>
      </MainLayout>
    )
}
