# Tango Algo

You all must have played LinkedIn game named Tango in which you have to fill the board with suns and moons following some conditions.

One day I was playing it and randomly thought:

> Hmm... can I write a program that solves this?

An algorithm that looks at the board and figures out the answer.

So naturally I wasted an days doing exactly that.

In this post I'll go through how I built the solver, the mistakes I made, the weird decisions that worked, and some that definitely didn't.

---

## Understanding The Game

Tango is played on a 6×6 board.

Some cells are already filled and the remaining cells must be completed according to a few rules.

The rules are:

* Each row and column must contain the same number of suns and moons.
* No more than 2 suns or moons can be next to each other horizontally or vertically.
* Cells separated by an "=" sign must contain the same value.
* Cells separated by an "X" sign must contain opposite values.

For convenience I'll represent:

* Sun = 0
* Moon = 1

### My Hand Drawn Illustration

---

## First Thoughts

Whenever I see a grid my brain immediately goes:

> 2D array.

So that part was easy.

```python
board = [
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
]
```

But then came the question:

How do I represent the already filled cells?

---

## Dead End #1 - Filled Cells As Tuples

My first idea was to store filled cells as tuples.

Something like:

```python
(0, 0)
(2, 1)
(4, 5)
```

A cell only needs row and column right?

Well... not really.

Five minutes later I realized I also need to know what is inside that cell.

Just knowing that `(0,0)` is filled is useless.

I also need to know if it contains a sun or a moon.

So tuples alone were not enough.

### Final Choice

Dictionary.

```python
filled_cells = {
    (0,0): 0,
    (2,1): 1,
}

# function to fill the board
def place_filled_cells():
    for key in filled_cells.keys():
        r, c = key
        val = filled_cells[key]
        board[r][c] = val
```

Now I know both:

* where the cell is
* what value it contains

### My Hand Drawn Illustration

---

## Representing Constraints

The next thing to represent was the special constraints.

These are:

```text
=
```

and

```text
X
```

Both of them describe a relationship between two cells.

Since a cell is represented by a tuple, a relationship can simply be represented as two tuples.

```python
equal_constraints = [
    ((0,0),(0,1)),
    ((3,4),(4,4))
]
```

Same idea for opposite constraints.

```python
cross_constraints = [
    ((0,2),(1,2))
]
```

### My Hand Drawn Illustration

At this point I finally had enough information to describe an entire puzzle.

Now came the harder part.

Actually validating moves.

---

# Validation

Whenever the solver wants to place a value in a cell it must answer one question:

> Is this placement legal?

To answer that we need to check all the rules.

---

## Rule 1 - Row And Column Counts

Since the board is always 6×6 we know every row and column must contain:

* 3 suns
* 3 moons

So every time I place a value I need to know how many of that value already exist in that row and column.

My solution was to keep counters.

```python
row0
row1

column0
column1
```

Each index represents a row or column.

For example:

```python
row0[2]
```

means:

> How many suns are currently present in row 2?

### Why Track Counts?

Without counts I'd have to repeatedly scan rows and columns every single time I wanted to validate a move.

That felt wasteful.

So instead I keep the information updated as the board changes.

### Initializing The Counts

```python
row0 = [0,0,0,0,0,0]
row1 = [0,0,0,0,0,0]
column0 = [0,0,0,0,0,0]
column1 = [0,0,0,0,0,0]

def initialize_counts():
    for (r, c), val in filled_cells.items():
        if val == 0:
            row0[r] += 1
            column0[c] += 1
        else:
            row1[r] += 1
            column1[c] += 1
```

### Validation Function

This function checks whether placing a value would exceed the allowed count in its row or column.

```python
def validate_counts(r, c, val):
    if val == 0:
        if row0[r] >= 3 or column0[c] >= 3:
            return False
    else:        
        if row1[r] >= 3 or column1[c] >= 3:
            return False
    return True
```

---

## Bug #1

This is actually one of the bugs that took me longer than I'd like to admit.

Initially I created the counts correctly.

But I forgot to update them while solving.

Meaning:

* validation used old counts
* counts became stale
* one of the constraints was basically useless

The solver still found solutions.

But it explored way more possibilities than necessary and backtracked a lot more.

Once I started updating counts whenever a value was placed or removed, the difference was immediately noticeable.

```python
def update_counts(r, c, val, delta):
    if val == 0:
        row0[r] += delta
        column0[c] += delta
    else:
        row1[r] += delta
        column1[c] += delta
```

When placing a value:

```python
update_counts(r, c, val, 1)
```

When backtracking:

```python
update_counts(r, c, val, -1)
```

---

## Rule 2 - No Three Consecutive Values

This was the part where I changed my mind halfway through.

### First Idea

My first idea was surprisingly brute force.

Whenever I wanted to place a value I planned to:

1. Build strings around that cell.
2. Generate all possible triples.
3. Search for:

```text
000
```

or

```text
111
```

If found:

```python
return False
```

Simple.

But while drawing the patterns on paper I noticed something.

A newly placed cell can only participate in a limited number of forbidden triples.

There are only six possibilities.

### My Hand Drawn Illustration

They are:

```text
00X
0X0
X00
```

and the same vertically.

Once I realized this I completely dropped the string idea.

Instead of generating combinations and searching strings, I could directly check those six patterns.

Much simpler.

Much faster.

### Validation Function

```python
def check_three_consecutive(r, c, val):

    # Horizontal patterns

    # val val X
    if c >= 2:
        if board[r][c-1] == val and board[r][c-2] == val:
            return False

    # X val val
    if c <= 3:
        if board[r][c+1] == val and board[r][c+2] == val:
            return False

    # val X val
    if 1 <= c <= 4:
        if board[r][c-1] == val and board[r][c+1] == val:
            return False

    # Vertical patterns

    # val val X
    if r >= 2:
        if board[r-1][c] == val and board[r-2][c] == val:
            return False

    # X val val
    if r <= 3:
        if board[r+1][c] == val and board[r+2][c] == val:
            return False

    # val X val
    if 1 <= r <= 4:
        if board[r-1][c] == val and board[r+1][c] == val:
            return False

    return True
```

---

## Rule 3 - Special Constraints

This part was honestly less interesting.

I already had all constraints stored.

So for a given cell I simply:

1. Look for constraints involving that cell.
2. Find the paired cell.
3. Check whether the relationship is satisfied.

For "=" constraints:

```python
A == B
```

For "X" constraints:

```python
A != B
```

### My Hand Drawn Illustration

### Validation Function

```python
def check_constraints(r, c, val):

    # "=" constraints
    for a, b in equal_constraints:
        if (r, c) == a:
            rr, cc = b
            if board[rr][cc] is not None and board[rr][cc] != val:
                return False

        elif (r, c) == b:
            rr, cc = a
            if board[rr][cc] is not None and board[rr][cc] != val:
                return False

    # "x" constraints
    for a, b in cross_constraints:
        if (r, c) == a:
            rr, cc = b
            if board[rr][cc] is not None and board[rr][cc] == val:
                return False

        elif (r, c) == b:
            rr, cc = a
            if board[rr][cc] is not None and board[rr][cc] == val:
                return False

    return True
```

---

## Putting Validation Together

After implementing all checks I wrapped them into a single function.

```python
is_valid(r, c, val)
```

which simply asks:

> Can this value legally be placed here?

If any rule fails:

```python
False
```

Otherwise:

```python
True
```

At this point I could validate moves.


```python
def is_valid(r, c, val):

    if not validate_rows_and_columns_count(r, c, val):
        return False

    if not check_three_consecutive(r, c, val):
        return False

    if not check_constraints(r, c, val):
        return False

    return True
```
Now I needed a way to actually solve the board.

---

# The Solver

This was the section where I knew what I wanted but not exactly how to get there.

I knew one thing.

Simply looping through the board and placing values would eventually get stuck.

Imagine reaching a cell where:

```text
0 -> invalid
1 -> invalid
```

Now what?

The algorithm has to somehow go back and change an earlier decision.

That immediately suggested:

> Backtracking.

I already knew the general idea but I wasn't completely sure about the structure, so I used AI to discuss a few approaches before settling on recursion.

---

## Empty Cells

Instead of traversing the entire board repeatedly, I decided to track only the cells that actually need solving.

```python
empty_cells
```

contains all unfilled positions.

### Why?

Because once I reach the end of this list:

```python
index == len(empty_cells)
```

I automatically know the board is complete.

No extra scanning required.

```python
empty_cells = [(0,0), (0,1), (0,2), (0,3), (0,4), (0,5),
               (1,0), (1,1), (1,2), (1,3), (1,4), (1,5),
               (2,0), (2,1), (2,2), (2,3), (2,4), (2,5),
               (3,0), (3,1), (3,2), (3,3), (3,4), (3,5),
               (4,0), (4,1), (4,2), (4,3), (4,4), (4,5),
               (5,0), (5,1), (5,2), (5,3), (5,4), (5,5)]

empty_cells = sorted(empty_cells - filled_cells.keys())
```

---

## The Decision Tree

Every empty cell has two possible values.

```text
0
1
```

So every move creates two branches.

### My Hand Drawn Illustration

The solver works like this:

1. Pick an empty cell.
2. Try 0.
3. Validate.
4. If valid, continue.
5. If stuck later, undo the move.
6. Try 1.

Keep repeating until:

* solution found
* all possibilities exhausted

That is basically backtracking.

### Solver Function

```python
def solve(index=0):

    # board completed
    if index == len(empty_cells):
        return True

    r, c = empty_cells[index]

    for val in [0, 1]:
        if is_valid(r, c, val):
            board[r][c] = val
            update_counts(r, c, val, 1)

            if solve(index + 1):
                return True

            update_counts(r, c, val, -1)
            board[r][c] = None

    return False
```

---

## Why Updating Counts Matters

Remember the bug from earlier?

This is exactly where it hurt.

Without updating counts during recursion, the solver keeps exploring branches that should have been rejected much earlier.

Updating the counters turned out to be one of the biggest improvements in the implementation.

Not because it made the algorithm smarter.

Because it stopped it from being stupid.

---

# Result

Eventually the solver fills every empty cell while satisfying:

* row constraints
* column constraints
* consecutive value constraints
* special constraints

### My Hand Drawn Illustration

And that's pretty much it.

No fancy optimization.

No clever mathematical observation.

Just a bunch of small decisions, a few wrong turns, some debugging, and a recursive function doing most of the heavy lifting.

---

# What Worked

* Dictionary representation for filled cells.
* Tracking counts instead of recalculating them.
* Pattern-based triple checking.
* Backtracking with recursion.

# What Didn't

* Representing filled cells using tuples alone.
* The string-based triple detection idea.
* Forgetting to update counts during recursion.

# What I'd Try Next

If I revisit this later I'd probably approach it more like a Constraint Satisfaction Problem instead of simply going through the empty cells one by one.

Right now the solver mostly fills cells and backtracks when it gets stuck. But there is already a lot of information available before making any guesses.

For example:

* If a row already has 2 suns filled, then I immediately know the remaining cell must be a moon.
* If a cell is part of a special constraint and its paired cell already has a value, then I can directly determine what goes in the other cell.
* If a row or column is close to being completed, I can often deduce values without exploring both possibilities.

So instead of treating every empty cell equally, I'd first analyze the filled cells and propagate all the constraints I can find. That should reduce the amount of backtracking significantly and make the solver feel a lot smarter.

But for now I'm happy that a random thought while playing Tango turned into an algorithm.

# Resources
Below are resources related to this write-up and solver:

- [Complete code file: Tango.py]()
- [Original sketches: notes and drafts used while designing the solver]()
- [Blog's First Draft]()
