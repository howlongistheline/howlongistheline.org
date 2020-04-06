---
name: Issue template
about: A standard C4 issue template
title: 'problem: '
labels: ''
assignees: ''

---

### The user or Contributor SHOULD write the issue by describing the problem they face or observe.   
“Problem: we need feature X. Solution: make it” is not a good issue. “Problem: user cannot do common tasks A or B except by using a complex workaround. Solution: make feature X” is a decent explanation. 

Document the *problem* first, solution (optional) second.

By stating the problem explicitly we give others a chance to correct our logic. “You’re only using A and B a lot because function C is unreliable. Solution: make function C work properly.”

### Users SHALL NOT log feature requests, ideas, suggestions, or any solutions to problems that are not explicitly documented and provable.   

There are several reasons for not logging ideas, suggestions, or feature requests. In our experience, these just accumulate in the issue tracker until someone deletes them. But more profoundly, when we treat all change as problem solutions, we can prioritize trivially. Either the problem is real and someone wants to solve it now, or it’s not on the table. Thus, wish lists are off the table.
