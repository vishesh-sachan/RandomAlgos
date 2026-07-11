# Queens Algo

After building Tango Algo, I knew I wanted to solve another LinkedIn puzzle. Queens had recently been added, and before I even tried solving it myself, my brain immediately went:

> *"How would I write an algorithm for this?"*

Unlike Tango, I didn't have any obvious starting point. There weren't different types of constraints that could be checked independently, and I wasn't even sure what data structures I wanted.

So I did what I usually do.

Forget the algorithm for a minute.

Let's first figure out how to represent the problem.

---

# Understanding the Game

Queens is played on a **n×n grid**.

The board is divided into coloured regions, and the goal is to place queens while satisfying a few rules.

* Every row contains exactly one queen.
* Every column contains exactly one queen.
* Every coloured region contains exactly one queen.
* Two queens can never touch each other, not even diagonally.

### ✏️ Hand Drawn Illustration

> **Placeholder:** Draw a sample Queens board showing coloured regions and the four rules visually.

---

# Representing the Board

The board itself was easy.

Whenever I see a puzzle on a grid, my brain immediately says:

> 2D array.

```python
board = [
    [None for _ in range(7)]
    for _ in range(7)
]
```

Nothing interesting there.

The interesting part was the coloured regions.

Since every region must contain exactly one queen, I needed a way to quickly get every cell belonging to a region.

My first thought was simply a dictionary.

```python
regions = {
    "red": [(0,0), (0,1), (1,0)],
    "blue": [(2,4), (2,5)],
    ...
}
```

The key is the region colour, and the value is every cell belonging to that region.

Simple enough.

---

## Tracking Remaining Cells

I also created another list.

```python
empty_cells = [
    (r, c)
    for r in range(7)
    for c in range(7)
]
```

Originally I thought this would help me know when the puzzle was solved.

At the time it seemed useful, so I kept it around.

I wasn't entirely sure whether I'd actually need it.

---

# Where Should the Solver Start?

Now came the interesting part.

Suppose we have all the regions.

Which one should we solve first?

My first thought was honestly...

> Just go from top to bottom.

But after staring at the board for a while something clicked.

Not every region is the same size.

Some regions have only **2 possible cells**.

Some have **6 or 7**.

If a region only has two possible places for its queen, why wouldn't I solve that first?

Even if both possibilities fail, I've only explored two branches.

If I start with a huge region instead, the branching factor immediately becomes much larger.

So from this point onward, the algorithm would always pick the **smallest remaining region**.

It wasn't some fancy optimization.

It just felt like common sense.

### ✏️ Hand Drawn Illustration

> **Placeholder:** Draw two regions, one with 2 cells and another with 6 cells. Show why starting with the smaller one creates fewer possibilities.

---

# Placing a Queen

Suppose we've picked the smallest region.

Now we simply choose one of its cells and place a queen.

The moment we do that, a lot of other cells become impossible.

Every cell in the same row.

Every cell in the same column.

Every neighbouring cell.

Those cells can never contain another queen.

I started calling them **blocked cells**.

So naturally I needed a function that, given a queen position, removes every blocked cell.

Something like:

```python
prune(cell)
```

The idea was simple.

It would return a **new copy** of the updated regions and remaining cells after blocking everything affected by that queen.

### ✏️ Hand Drawn Illustration

> **Placeholder:** Draw a queen with its blocked row, column and neighbouring cells highlighted.

---

# A Representation Problem

While thinking about `prune()`, I started questioning my own representation again.

Removing blocked cells from `empty_cells` is straightforward.

Just remove them.

Removing blocked cells from `regions` is a little more awkward because every blocked cell also has to disappear from whichever region it belongs to.

Now I had two different places storing similar information.

I spent quite a while trying to think of a cleaner representation.

Could everything be stored in one place?

Could I get rid of `empty_cells` entirely?

I couldn't come up with anything better.

Eventually I gave up thinking about it and decided:

> I'll keep the current representation and continue building the solver.

Sometimes moving forward teaches you more than overthinking.

---

# The First Solver

At this point the recursive algorithm looked pretty straightforward.

1. Pick the smallest region.
2. Pick one cell.
3. Place a queen.
4. Prune blocked cells.
5. Repeat.

Eventually every region should have a queen.

Done.

Or so I thought.

---

# The First Flaw

While mentally running through the algorithm, one annoying question popped into my head.

> What happens if an entire region disappears before I ever place a queen there?

Imagine this.

Region **R1** gets its queen.

Some cells of **R2** become blocked.

Later, **R3** gets its queen.

More cells disappear.

Then **R4**.

Eventually...

Every cell belonging to **R2** has been removed.

But...

I never actually placed a queen in R2.

The solver has quietly created an impossible board without realizing it.

That means `prune()` couldn't blindly delete cells.

It also had to check whether deleting those cells completely removed a region that had never received a queen.

If that happened, the current path had already failed.

Time to backtrack.

### ✏️ Hand Drawn Illustration

> **Placeholder:** Draw four regions where queens placed in R1, R3 and R4 gradually eliminate every cell in R2.

---

# Building the Recursive Solver

Now the recursion became much clearer.

Pick the smallest region.

Choose one of its cells.

Call `prune()`.

If pruning fails, try another cell.

Otherwise, recursively solve the smaller problem.

Eventually every region disappears because every region has received its queen.

---

# Another Bug

I thought I was almost done.

Then I noticed something strange.

The recursion looked perfectly fine.

But every recursive call seemed to be pruning exactly the same board.

That's when I realized the mistake.

My function looked like this:

```python
prune(cell)
```

It only knew which cell I wanted to place.

It had no idea about the already pruned board produced by previous recursive calls.

Every single recursive call was starting from the original puzzle again.

So while each individual pruning was correct, they weren't building on each other.

The fix was simply to pass the updated state.

```python
def prune_cells(cell, empty_cells, regions):
```

Now every recursive call receives the smaller problem produced by the previous one.

Exactly what recursion is supposed to do.

---

# Finishing the Solver

With that bug fixed, the solver was finally complete.

The recursive function became surprisingly small.

1. Pick the smallest region.
2. Try every possible cell.
3. Prune.
4. If pruning succeeds, recurse.
5. If recursion fails, backtrack and try another cell.

Nothing particularly clever.

Just repeatedly making the problem smaller until either every region has a queen or no valid moves remain.

```python
def solve(regions, empty_cells):
```

### ✏️ Hand Drawn Illustration

> **Placeholder:** Draw the recursion tree showing successful branches and backtracking.

---

# One Last Realization

Remember `empty_cells`?

The list I created near the beginning because I thought I'd need it to detect when the puzzle was solved?

Turns out...

I never actually used it.

Originally my base case was going to be:

```python
len(empty_cells) == 0
```

But while finishing the recursion I noticed something.

Every time I successfully place a queen, that region is removed from the `regions` dictionary.

That means an empty `regions` dictionary already tells me exactly the same thing.

```python
if not regions:
```

Every region has been assigned a queen.

Puzzle solved.

So `empty_cells` quietly became unnecessary.

I left it in for a while before finally removing it.

It was one of those variables that seemed important at the beginning but slowly became irrelevant as the algorithm evolved.

---

# Final Algorithm

The final idea ended up being surprisingly simple.

* Represent the board as a 2D array.
* Store every coloured region in a dictionary.
* Always solve the smallest remaining region first.
* After placing a queen, prune every blocked cell.
* If pruning invalidates a region, backtrack.
* Repeat until no regions remain.

---

# Looking Back

I'm sure there are cleaner ways to solve this puzzle.

There are probably smarter heuristics, better representations, and more efficient pruning strategies.

But that's never really been the goal of Random Algo.

The goal isn't to present the perfect solution.

It's to document how I arrived at *my* solution.

The little observations.

The dead ends.

The bugs.

The moments where something suddenly clicked.

This solver started the same way Tango Algo did.

With a completely random thought.

> *"I wonder if I can write an algorithm for this?"*

A few hours later, that random thought had turned into another working algorithm.

And honestly, that's my favourite part.
