import Title from '../components/Title.tsx'
import TryAlgorithm from '../components/TryAlgorithm.tsx'
import CodeBlock from '../components/CodeBlock.tsx'
import H1 from '../components/H1.tsx'
import H2 from '../components/H2.tsx'
import boardCode from './tango-code.ts'

// code block example 
{/* <CodeBlock
  filename="binary-search.js"
  language="javascript"
  code={binarySearchCode}
/> */}

// img example
{/* <div>
  <img src="" alt="" style={{ width: 'auto', height: 'auto' }} />
  <p className="text-xs text-gray-400 uppercase tracking-wide">
    {caption}
  </p>
</div> */}

function Tango() {
  return (
    <article className="w-full max-w-4xl mx-auto flex flex-col gap-8">

      <header className="flex flex-col gap-3">

        <div className="inline-flex border border-white px-2 py-1 w-fit text-xs uppercase tracking-widest">
          Algorithm
        </div>

        <Title title="Building a Solver for LinkedIn's Tango Puzzle" /> {/* title */}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-gray-400 text-xs uppercase">

          <span>&gt; DATE: 2026-05-29</span> {/* date */}

          <span>&gt; AUTHOR: Vishesh</span>

        </div>

      </header>

      {/* <div className="w-full overflow-hidden rounded-lg">
        <img src="/cover.png" alt="cover image" className="w-full h-64 md:h-96 object-cover" />
      </div> */}

      <div>
        <TryAlgorithm url="/visualizers/tango" /> {/* link to try algorithm */}
      </div>

      <div className="flex flex-col gap-6 text-gray-300 leading-8">
        {/* post content  */}
        <p>
          You all must have played LinkedIn game named Tango in which
          you have to fill the board with suns and moons following
          some conditions.
        </p>
        <p>
          One day I was playing it and randomly thought:
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          Hmm... can I write a program that solves this?
        </blockquote>

        <p>
          An algorithm that looks at the board and figures out the answer.
        </p>

        <p>
          So naturally I wasted days doing exactly that.
        </p>

        <p>
          In this post I'll go through how I built the solver,
          the mistakes I made, the weird decisions that worked,
          and some that definitely didn't.
        </p>

        <hr className='border-gray-300' />
        <H1 text="Understanding The Game" />
        <hr className='border-gray-300' />

        <p>
          Tango is played on a 6x6 board.
        </p>

        <p>
          Some cells are already filled and the remaining cells must be
          completed according to a few rules.
        </p>
        <p>
          The rules are:
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>Each row and column must contain the same number of suns and moons.</li>
          <li>No more than 2 suns or moons can be next to each other horizontally or vertically.</li>
          <li>Cells separated by an "=" sign must contain the same value.</li>
          <li>Cells separated by an "X" sign must contain opposite values.</li>
        </ul>

        <p>For convenience I'll represent:</p>

        <ul className="list-disc pl-5 space-y-2">
          <li>Sun = 0</li>
          <li>Moon = 1</li>
        </ul>

        <div>
          <img src="/board.png" alt="Tango Board" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Tango Board
          </p>
        </div>
        <hr className='border-gray-300' />
        <H1 text="First Thoughts" />
        <hr className='border-gray-300' />

        <p>
          Whenever I see a grid my brain immediately goes:
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          2D array.
        </blockquote>
        <p>
          So that part was easy.
        </p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="board"
            language="python"
            code={boardCode}
          />
        </div>

        <p>
          But then came the question:
        </p>

        <p>
          How do I represent the already filled cells?
        </p>

        <hr className='border-gray-300' />
        <H1 text="Dead End #1 - Filled Cells As Tuples" />
        <hr className='border-gray-300' />

        <p>
          My first idea was to store filled cells as tuples.
        </p>
        <p>
          Something like:
        </p>
        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="tuples"
            language="python"
            code={`(0,0)
(2,1)
(4,5)`}
          />
        </div>
        <p>
          A cell only needs row and column right?
        </p>
        <p>
          Well... not really.
        </p>
        <p>
          Five minutes later I realized I also need to know what is
          inside that cell.
        </p>
        <p>
          Just knowing that <b>(0,0)</b> is filled is useless.
        </p>
        <p>
          I also need to know if it contains a sun or a moon.
        </p>
        <p>
          So tuples alone were not enough.
        </p>

        <H2 text="Final Choice" />

        <p>Dictionary.</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="filled_cells"
            language="python"
            code={`filled_cells = {
  (0,0): 0,
  (2,1): 1
}`}
          />
        </div>
          <p>
            Now I know both:
          </p>
  
          <ul className="list-disc pl-5 space-y-2">
            <li>where the cell is</li>
            <li>what value it contains</li>
          </ul>

        <div>
          <img src="/constants.png" alt="Constants" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Constants
          </p>
        </div>

        <hr className='border-gray-300' />
        <H1 text="Representing Constraints" />
        <hr className='border-gray-300' />

        <p>
          The next thing to represent was the special constraints.
        </p>

        <p>These are:</p>

        <div className="overflow-x-auto">
          {/*  */}
            <CodeBlock
              filename="constraints"
              language="text"
              code={`=
And
X`}
            />
        </div>

        <p>
          Both of them describe a relationship between two cells.
        </p>

        <p>
          Since a cell is represented by a tuple, a relationship can simply be
          represented as two tuples.
        </p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="equal_constraints"
            language="python"
            code={`equal_constraints = [
      ((0,0),(0,1)),
      ((3,4),(4,4))
  ]`}
          />
        </div>
          <div>
            <img src="/equal.png" alt="Equal" style={{ width: 'auto', height: 'auto' }} />
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Equal
            </p>
          </div>

        <p>Same idea for opposite constraints.</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="cross_constraints"
            language="python"
            code={`cross_constraints = [
      ((0,2),(1,2))
  ]`}
          />
        </div>

        <div>
          <img src="/cross.png" alt="Cross" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Cross
          </p>
        </div>

        <p>
          At this point I finally had enough information to describe an entire puzzle.
        </p>

        <p>
          Now came the harder part.
        </p>

        <p>
          Actually validating moves.
        </p>

        <hr className='border-gray-300' />
        <H1 text="Validation" />
        <hr className='border-gray-300' />

        <p>
          Whenever the solver wants to place a value in a cell it must answer one question:
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          Is this placement legal?
        </blockquote>

        <p>
          To answer that we need to check all the rules.
        </p>

        <hr className='border-gray-300' />
        <H2 text="Rule 1 - Row And Column Counts" />
        <hr className='border-gray-300' />

        <p>
          Since the board is always 6x6 we know every row and column must contain:
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>3 suns</li>
          <li>3 moons</li>
        </ul>

        <p>
          So every time I place a value I need to know how many of that value already exist in that row and column.
        </p>

        <p>My solution was to keep counters.</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="counters"
            language="python"
            code={`row0
row1

column0
column1`}
          />
        </div>

        <p>
          Each index represents a row or column.
        </p>

        <p>For example:</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="row0_example"
            language="python"
            code={`row0[2]`}
          />
        </div>

        <p>
          means:
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          How many suns are currently present in row 2?
        </blockquote>

        <H2 text="Why Track Counts?" />

        <p>
          Without counts I'd have to repeatedly scan rows and columns every single time I wanted to validate a move.
        </p>

        <p>
          That felt wasteful.
        </p>

        <p>
          So instead I keep the information updated as the board changes.
        </p>

        <H2 text="Initializing The Counts" />

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="initialize_counts"
            language="python"
            code={`row0 = [0,0,0,0,0,0]
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
            column1[c] += 1`}
          />
        </div>

        <H2 text="Validation Function" />

        <p>
          This function checks whether placing a value would exceed the allowed count in its row or column.
        </p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="validate_counts"
            language="python"
            code={`def validate_counts(r, c, val):
        if val == 0:
            if row0[r] >= 3 or column0[c] >= 3:
                return False
        else:        
            if row1[r] >= 3 or column1[c] >= 3:
                return False
        return True`}
          />
        </div>
        <hr className='border-gray-300' />
        <H2 text="Bug #1" />
        <hr className='border-gray-300' />

        <p>
          This is actually one of the bugs that took me longer than I'd like to admit.
        </p>

        <p>
          Initially I created the counts correctly.
        </p>

        <p>
          But I forgot to update them while solving.
        </p>

        <p>Meaning:</p>

        <ul className="list-disc pl-5 space-y-2">
          <li>validation used old counts</li>
          <li>counts became stale</li>
          <li>one of the constraints was basically useless</li>
        </ul>

        <p>
          The solver still found solutions.
        </p>

        <p>
          But it explored way more possibilities than necessary and backtracked a lot more.
        </p>

        <p>
          Once I started updating counts whenever a value was placed or removed, the difference was immediately noticeable.
        </p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="update_counts"
            language="python"
            code={`def update_counts(r, c, val, delta):
      if val == 0:
          row0[r] += delta
          column0[c] += delta
      else:
          row1[r] += delta
          column1[c] += delta`}
          />
        </div>

        <p>When placing a value:</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="place_count_update"
            language="python"
            code={`update_counts(r, c, val, 1)`}
          />
        </div>

        <p>When backtracking:</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="backtrack_count_update"
            language="python"
            code={`update_counts(r, c, val, -1)`}
          />
        </div>

        <hr className='border-gray-300' />
        <H2 text="Rule 2 - No Three Consecutive Values" />
        <hr className='border-gray-300' />

        <p>
          This was the part where I changed my mind halfway through.
        </p>

        <H2 text="First Idea" />

        <p>
          My first idea was surprisingly brute force.
        </p>

        <p>
          Whenever I wanted to place a value I planned to:
        </p>

        <ol className="list-decimal list-inside space-y-2">
          <li>Build strings around that cell.</li>
          <li>Generate all possible triples.</li>
          <li>Search for:</li>
        </ol>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="triples"
            language="text"
            code={`000
OR
111`}
          />
        </div>

        <p>If found:</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="reject"
            language="python"
            code={`return False`}
          />
        </div>

        <p>Simple.</p>

        <p>
          But while drawing the patterns on paper I noticed something.
        </p>

        <p>
          A newly placed cell can only participate in a limited number of forbidden triples.
        </p>

        <p>There are only six possibilities.</p>

        <div>
          <img src="/three-consecutive.png" alt="Three Consecutive" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Three Consecutive
          </p>
        </div>

        <p>They are:</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="patterns"
            language="text"
            code={`00X
0X0
X00`}
          />
        </div>

        <p>and the same vertically.</p>

        <p>
          Once I realized this I completely dropped the string idea.
        </p>

        <p>
          Instead of generating combinations and searching strings, I could directly check those six patterns.
        </p>

        <p>
          Much simpler.
        </p>

        <p>
          Much faster.
        </p>

        <H2 text="Validation Function" />

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="check_three_consecutive"
            language="python"
            code={`def check_three_consecutive(r, c, val):

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

      return True`}
          />
        </div>

        <hr className='border-gray-300' />
        <H2 text="Rule 3 - Special Constraints" />
        <hr className='border-gray-300' />

        <p>
          This part was honestly less interesting.
        </p>

        <p>
          I already had all constraints stored.
        </p>

        <p>
          So for a given cell I simply:
        </p>

        <ol className="list-decimal list-inside space-y-2">
          <li>Look for constraints involving that cell.</li>
          <li>Find the paired cell.</li>
          <li>Check whether the relationship is satisfied.</li>
        </ol>

        <p>For "=" constraints:</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="equal_rule"
            language="text"
            code={`A == B`}
          />
        </div>

        <p>For "X" constraints:</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="cross_rule"
            language="text"
            code={`A != B`}
          />
        </div>

        <H2 text="Validation Function" />

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="check_constraints"
            language="python"
            code={`def check_constraints(r, c, val):

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

      return True`}
          />
        </div>

        <H2 text="Putting Validation Together" />

        <p>
          After implementing all checks I wrapped them into a single function.
        </p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="is_valid"
            language="python"
            code={`is_valid(r, c, val)`}
          />
        </div>

        <p>
          which simply asks:
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          Can this value legally be placed here?
        </blockquote>

        <p>
          If any rule fails:
        </p>

        <div className="overflow-x-auto">
          {/*  */}
            <CodeBlock
              filename="failure"
              language="python"
              code={`False`}
            />
        </div>

        <p>Otherwise:</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="success"
            language="python"
            code={`True`}
          />
        </div>

        <p>
          At this point I could validate moves.
        </p>


        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="is_valid_function"
            language="python"
            code={`def is_valid(r, c, val):
              
              if not validate_rows_and_columns_count(r, c, val):
              return False
              
              if not check_three_consecutive(r, c, val):
              return False
              
              if not check_constraints(r, c, val):
              return False
              
              return True`}
              />
        </div>

        <p>
          Now I needed a way to actually solve the board.
        </p>
        <hr className='border-gray-300' />
        <H1 text="The Solver" />
        <hr className='border-gray-300' />

        <p>
          This was the section where I knew what I wanted but not exactly how to get there.
        </p>

        <p>I knew one thing.</p>

        <p>
          Simply looping through the board and placing values would eventually get stuck.
        </p>

        <p>Imagine reaching a cell where:</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="invalid_cell"
            language="text"
            code={`0 -> invalid
1 -> invalid`}
          />
        </div>

        <p>Now what?</p>

        <p>
          The algorithm has to somehow go back and change an earlier decision.
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          Backtracking.
        </blockquote>

        <p>
          I already knew the general idea but I wasn't completely sure about the structure, so I used AI to discuss a few approaches before settling on recursion.
        </p>

        <H2 text="Empty Cells" />

        <p>
          Instead of traversing the entire board repeatedly, I decided to track only the cells that actually need solving.
        </p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="empty_cells"
            language="python"
            code={`empty_cells`}
          />
        </div>

        <p>contains all unfilled positions.</p>

        <p>Why?</p>

        <p>
          Because once I reach the end of this list:
        </p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="done"
            language="python"
            code={`index == len(empty_cells)`}
          />
        </div>

        <p>
          I automatically know the board is complete.
        </p>

        <p>No extra scanning required.</p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="empty_cells_list"
            language="python"
            code={`empty_cells = [(0,0), (0,1), (0,2), (0,3), (0,4), (0,5),
                (1,0), (1,1), (1,2), (1,3), (1,4), (1,5),
                (2,0), (2,1), (2,2), (2,3), (2,4), (2,5),
                (3,0), (3,1), (3,2), (3,3), (3,4), (3,5),
                (4,0), (4,1), (4,2), (4,3), (4,4), (4,5),
                (5,0), (5,1), (5,2), (5,3), (5,4), (5,5)]

  empty_cells = sorted(empty_cells - filled_cells.keys())`}
          />
        </div>

        <H2 text="The Decision Tree" />

        <p>
          Every empty cell has two possible values.
        </p>

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="branching"
            language="text"
            code={`0
1`}
          />
        </div>

        <p>
          So every move creates two branches.
        </p>

        {/* <div>
          <img src="/d-tree.png" alt="Decision Tree" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Decision Tree
          </p>
        </div> */}
        <div>
          <img src="/backtrack-tree.png" alt="Backtracking Tree" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Backtracking Tree
          </p>
        </div>

        <p>The solver works like this:</p>

        <ol className="list-decimal list-inside space-y-2">
          <li>Pick an empty cell.</li>
          <li>Try 0.</li>
          <li>Validate.</li>
          <li>If valid, continue.</li>
          <li>If stuck later, undo the move.</li>
          <li>Try 1.</li>
        </ol>

        <p>Keep repeating until:</p>

        <ul className="list-disc pl-5 space-y-2">
          <li>solution found</li>
          <li>all possibilities exhausted</li>
        </ul>

        <p>That is basically backtracking.</p>

        <H2 text="Solver Function" />

        <div className="overflow-x-auto">
          {/*  */}
          <CodeBlock
            filename="solve"
            language="python"
            code={`def solve(index=0):

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

      return False`}
          />
        </div>

        <H2 text="Why Updating Counts Matters" />

        <p>
          Remember the bug from earlier?
        </p>

        <p>
          This is exactly where it hurt.
        </p>

        <p>
          Without updating counts during recursion, the solver keeps exploring branches that should have been rejected much earlier.
        </p>

        <p>
          Updating the counters turned out to be one of the biggest improvements in the implementation.
        </p>

        <p>
          Not because it made the algorithm smarter.
        </p>

        <p>
          Because it stopped it from being stupid.
        </p>

        <hr className='border-gray-300' />
        <H1 text="Result" />
        <hr className='border-gray-300' />

        <p>
          Eventually the solver fills every empty cell while satisfying:
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>row constraints</li>
          <li>column constraints</li>
          <li>consecutive value constraints</li>
          <li>special constraints</li>
        </ul>

        <div>
          <img src="/complete-board.png" alt="Completed Board" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Completed Board
          </p>
        </div>

        <p>And that's pretty much it.</p>

        <p>
          No fancy optimization.
        </p>

        <p>
          No clever mathematical observation.
        </p>

        <p>
          Just a bunch of small decisions, a few wrong turns, some debugging, and a recursive function doing most of the heavy lifting.
        </p>

        <hr className='border-gray-300' />
        <H1 text="What Worked" />
        <hr className='border-gray-300' />

        <ul className="list-disc pl-5 space-y-2">
          <li>Dictionary representation for filled cells.</li>
          <li>Tracking counts instead of recalculating them.</li>
          <li>Pattern-based triple checking.</li>
          <li>Backtracking with recursion.</li>
        </ul>

        <hr className='border-gray-300' />
        <H1 text="What Didn't" />
        <hr className='border-gray-300' />

        <ul className="list-disc pl-5 space-y-2">
          <li>Representing filled cells using tuples alone.</li>
          <li>The string-based triple detection idea.</li>
          <li>Forgetting to update counts during recursion.</li>
        </ul>

        <hr className='border-gray-300' />
        <H1 text="What I'd Try Next" />
        <hr className='border-gray-300' />

        <p>
          If I revisit this later I'd probably approach it more like a Constraint Satisfaction Problem instead of simply going through the empty cells one by one.
        </p>

        <p>
          Right now the solver mostly fills cells and backtracks when it gets stuck. But there is already a lot of information available before making any guesses.
        </p>

        <p>For example:</p>

        <ul className="list-disc pl-5 space-y-2">
          <li>If a row already has 2 suns filled, then I immediately know the remaining cell must be a moon.</li>
          <li>If a cell is part of a special constraint and its paired cell already has a value, then I can directly determine what goes in the other cell.</li>
          <li>If a row or column is close to being completed, I can often deduce values without exploring both possibilities.</li>
        </ul>

        <p>
          So instead of treating every empty cell equally, I'd first analyze the filled cells and propagate all the constraints I can find. That should reduce the amount of backtracking significantly and make the solver feel a lot smarter.
        </p>

        <p>
          But for now I'm happy that a random thought while playing Tango turned into an algorithm.
        </p>


      </div>

    </article>
  )
}

export default Tango