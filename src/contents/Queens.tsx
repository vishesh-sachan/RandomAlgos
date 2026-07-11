import Title from '../components/Title.tsx'
import TryAlgorithm from '../components/TryAlgorithm.tsx'
import CodeBlock from '../components/CodeBlock.tsx'
import H1 from '../components/H1.tsx'
import H2 from '../components/H2.tsx'

function Queens() {
  return (
    <article className="w-full max-w-4xl mx-auto flex flex-col gap-8">

      <header className="flex flex-col gap-3">

        <div className="inline-flex border border-white px-2 py-1 w-fit text-xs uppercase tracking-widest">
          Algorithm
        </div>

        <Title title="Queens Algo: Building a Solver One Wrong Turn at a Time" />

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-gray-400 text-xs uppercase">

          <span>&gt; DATE: 2026-07-10</span>

          <span>&gt; AUTHOR: Vishesh</span>

        </div>

      </header>

      <div>
        <TryAlgorithm url="/visualizers/queens" />
      </div>

      <div className="flex flex-col gap-6 text-gray-300 leading-8">
        {/* post content  */}
        <p>
          After building Tango Algo, I knew I wanted to solve another LinkedIn puzzle. Queens had recently been added, and before I even tried solving it myself, my brain immediately went:
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          "How would I write an algorithm for this?"
        </blockquote>

        <p>
          Unlike Tango, I didn't have any obvious starting point. There weren't different types of constraints that could be checked independently, and I wasn't even sure what data structures I wanted.
        </p>

        <p>
          So I did what I usually do.
        </p>

        <p>
          Forget the algorithm for a minute.
        </p>

        <p>
          Let's first figure out how to represent the problem.
        </p>

        <hr className='border-gray-300' />
        <H1 text="Understanding the Game" />
        <hr className='border-gray-300' />

        <p>
          Queens is played on a <b>nXn grid</b>.
        </p>

        <p>
          The board is divided into coloured regions, and the goal is to place queens while satisfying a few rules.
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>Every row contains exactly one queen.</li>
          <li>Every column contains exactly one queen.</li>
          <li>Every coloured region contains exactly one queen.</li>
          <li>Two queens can never touch each other, not even diagonally.</li>
        </ul>

        <div>
          <img src="/queens/rules-1-2.jpg" alt="Queens board showing rules 1 and 2" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide mt-5">
            Rules 1 and 2
          </p>
        </div>
        <div>
          <img src="/queens/rules-3-4.jpg" alt="Queens board showing rules 3 and 4" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide mt-5">
            Rules 3 and 4
          </p>
        </div>

        <hr className='border-gray-300' />
        <H1 text="Representing the Board" />
        <hr className='border-gray-300' />

        <p>
          The board itself was easy.
        </p>

        <p>
          Whenever I see a puzzle on a grid, my brain immediately says:
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          2D array.
        </blockquote>

        <div className="overflow-x-auto">
          <CodeBlock
            filename="board"
            language="python"
            code={`board = [
    [None for _ in range(7)]
    for _ in range(7)
]`}
          />
        </div>

        <p>
          Nothing interesting there.
        </p>

        <p>
          The interesting part was the coloured regions.
        </p>

        <p>
          Since every region must contain exactly one queen, I needed a way to quickly get every cell belonging to a region.
        </p>

        <p>
          My first thought was simply a dictionary.
        </p>

        <div className="overflow-x-auto">
          <CodeBlock
            filename="regions"
            language="python"
            code={`regions = {
    "red": [(0,0), (0,1), (1,0)],
    "blue": [(2,4), (2,5)],
    ...
}`}
          />
        </div>

        <p>
          The key is the region colour, and the value is every cell belonging to that region.
        </p>

        <p>
          Simple enough.
        </p>

        <hr className='border-gray-300' />
        <H2 text="Tracking Remaining Cells" />
        <hr className='border-gray-300' />

        <p>
          I also created another list.
        </p>

        <div className="overflow-x-auto">
          <CodeBlock
            filename="empty_cells"
            language="python"
            code={`empty_cells = [
    (r, c)
    for r in range(7)
    for c in range(7)
]`}
          />
        </div>

        <p>
          Originally I thought this would help me know when the puzzle was solved.
        </p>

        <p>
          At the time it seemed useful, so I kept it around.
        </p>

        <p>
          I wasn't entirely sure whether I'd actually need it.
        </p>

        <hr className='border-gray-300' />
        <H1 text="Where Should the Solver Start?" />
        <hr className='border-gray-300' />

        <p>
          Now came the interesting part.
        </p>

        <p>
          Suppose we have all the regions.
        </p>

        <p>
          Which one should we solve first?
        </p>

        <p>
          My first thought was honestly...
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          Just go from top to bottom.
        </blockquote>

        <p>
          But after staring at the board for a while something clicked.
        </p>

        <p>
          Not every region is the same size.
        </p>

        <p>
          Some regions have only <b>2 possible cells</b>.
        </p>

        <p>
          Some have <b>6 or 7</b>.
        </p>

        <p>
          If a region only has two possible places for its queen, why wouldn't I solve that first?
        </p>

        <p>
          Even if both possibilities fail, I've only explored two branches.
        </p>

        <p>
          If I start with a huge region instead, the branching factor immediately becomes much larger.
        </p>

        <p>
          So from this point onward, the algorithm would always pick the <b>smallest remaining region</b>.
        </p>

        <p>
          It wasn't some fancy optimization.
        </p>

        <p>
          It just felt like common sense.
        </p>

        <div>
          <img src="/queens/region-size-comparison.png" alt="Two regions showing why smaller region first reduces branching" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide mt-5">
            Region Size Comparison
          </p>
        </div>

        <hr className='border-gray-300' />
        <H1 text="Placing a Queen" />
        <hr className='border-gray-300' />

        <p>
          Suppose we've picked the smallest region.
        </p>

        <p>
          Now we simply choose one of its cells and place a queen.
        </p>

        <p>
          The moment we do that, a lot of other cells become impossible.
        </p>

        <p>
          Every cell in the same row.
        </p>

        <p>
          Every cell in the same column.
        </p>

        <p>
          Every neighbouring cell.
        </p>

        <p>
          Those cells can never contain another queen.
        </p>

        <p>
          I started calling them <b>blocked cells</b>.
        </p>

        <p>
          So naturally I needed a function that, given a queen position, removes every blocked cell.
        </p>

        <p>
          Something like:
        </p>

        <div className="overflow-x-auto">
          <CodeBlock
            filename="prune"
            language="python"
            code={`prune(cell)`}
          />
        </div>

        <p>
          The idea was simple.
        </p>

        <p>
          It would return a <b>new copy</b> of the updated regions and remaining cells after blocking everything affected by that queen.
        </p>

        <div>
          <img src="/queens/blocked-cells.png" alt="Queen with blocked row, column and neighbouring cells highlighted" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide mt-5">
            Blocked Cells
          </p>
        </div>

        <hr className='border-gray-300' />
        <H1 text="A Representation Problem" />
        <hr className='border-gray-300' />

        <p>
          While thinking about <code>prune()</code>, I started questioning my own representation again.
        </p>

        <p>
          Removing blocked cells from <code>empty_cells</code> is straightforward.
        </p>

        <p>
          Just remove them.
        </p>

        <p>
          Removing blocked cells from <code>regions</code> is a little more awkward because every blocked cell also has to disappear from whichever region it belongs to.
        </p>

        <p>
          Now I had two different places storing similar information.
        </p>

        <p>
          I spent quite a while trying to think of a cleaner representation.
        </p>

        <p>
          Could everything be stored in one place?
        </p>

        <p>
          Could I get rid of <code>empty_cells</code> entirely?
        </p>

        <p>
          I couldn't come up with anything better.
        </p>

        <p>
          Eventually I gave up thinking about it and decided:
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          I'll keep the current representation and continue building the solver.
        </blockquote>

        <p>
          Sometimes moving forward teaches you more than overthinking.
        </p>

        <hr className='border-gray-300' />
        <H1 text="The First Solver" />
        <hr className='border-gray-300' />

        <p>
          At this point the recursive algorithm looked pretty straightforward.
        </p>

        <ol className="list-decimal list-inside space-y-2">
          <li>Pick the smallest region.</li>
          <li>Pick one cell.</li>
          <li>Place a queen.</li>
          <li>Prune blocked cells.</li>
          <li>Repeat.</li>
        </ol>

        <p>
          Eventually every region should have a queen.
        </p>

        <p>
          Done.
        </p>

        <p>
          Or so I thought.
        </p>

        <hr className='border-gray-300' />
        <H1 text="The First Flaw" />
        <hr className='border-gray-300' />

        <p>
          While mentally running through the algorithm, one annoying question popped into my head.
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          What happens if an entire region disappears before I ever place a queen there?
        </blockquote>

        <p>
          Imagine this.
        </p>

        <p>
          Region <b>R1</b> gets its queen.
        </p>

        <p>
          Some cells of <b>R2</b> become blocked.
        </p>

        <p>
          Later, <b>R3</b> gets its queen.
        </p>

        <p>
          More cells disappear.
        </p>

        <p>
          Then <b>R4</b>.
        </p>

        <p>
          Eventually...
        </p>

        <p>
          Every cell belonging to <b>R2</b> has been removed.
        </p>

        <p>
          But...
        </p>

        <p>
          I never actually placed a queen in R2.
        </p>

        <p>
          The solver has quietly created an impossible board without realizing it.
        </p>

        <p>
          That means <code>prune()</code> couldn't blindly delete cells.
        </p>

        <p>
          It also had to check whether deleting those cells completely removed a region that had never received a queen.
        </p>

        <p>
          If that happened, the current path had already failed.
        </p>

        <p>
          Time to backtrack.
        </p>

        {/* TODO: add image - Draw four regions where queens placed in R1, R3 and R4 gradually eliminate every cell in R2
        <div>
          <img src="" alt="Four regions showing how queens placed in R1, R3, R4 gradually eliminate every cell in R2" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Region Elimination 
          </p>
        </div> */}

        <hr className='border-gray-300' />
        <H1 text="Building the Recursive Solver" />
        <hr className='border-gray-300' />

        <p>
          Now the recursion became much clearer.
        </p>

        <p>
          Pick the smallest region.
        </p>

        <p>
          Choose one of its cells.
        </p>

        <p>
          Call <code>prune()</code>.
        </p>

        <p>
          If pruning fails, try another cell.
        </p>

        <p>
          Otherwise, recursively solve the smaller problem.
        </p>

        <p>
          Eventually every region disappears because every region has received its queen.
        </p>

        <hr className='border-gray-300' />
        <H1 text="Another Bug" />
        <hr className='border-gray-300' />

        <p>
          I thought I was almost done.
        </p>

        <p>
          Then I noticed something strange.
        </p>

        <p>
          The recursion looked perfectly fine.
        </p>

        <p>
          But every recursive call seemed to be pruning exactly the same board.
        </p>

        <p>
          That's when I realized the mistake.
        </p>

        <p>
          My function looked like this:
        </p>

        <div className="overflow-x-auto">
          <CodeBlock
            filename="initial_prune"
            language="python"
            code={`prune(cell)`}
          />
        </div>

        <p>
          It only knew which cell I wanted to place.
        </p>

        <p>
          It had no idea about the already pruned board produced by previous recursive calls.
        </p>

        <p>
          Every single recursive call was starting from the original puzzle again.
        </p>

        <p>
          So while each individual pruning was correct, they weren't building on each other.
        </p>

        <p>
          The fix was simply to pass the updated state.
        </p>

        <div className="overflow-x-auto">
          <CodeBlock
            filename="fixed_prune"
            language="python"
            code={`def prune_cells(cell, empty_cells, regions):`}
          />
        </div>

        <p>
          Now every recursive call receives the smaller problem produced by the previous one.
        </p>

        <p>
          Exactly what recursion is supposed to do.
        </p>

        <hr className='border-gray-300' />
        <H1 text="Finishing the Solver" />
        <hr className='border-gray-300' />

        <p>
          With that bug fixed, the solver was finally complete.
        </p>

        <p>
          The recursive function became surprisingly small.
        </p>

        <ol className="list-decimal list-inside space-y-2">
          <li>Pick the smallest region.</li>
          <li>Try every possible cell.</li>
          <li>Prune.</li>
          <li>If pruning succeeds, recurse.</li>
          <li>If recursion fails, backtrack and try another cell.</li>
        </ol>

        <p>
          Nothing particularly clever.
        </p>

        <p>
          Just repeatedly making the problem smaller until either every region has a queen or no valid moves remain.
        </p>

        <div className="overflow-x-auto">
          <CodeBlock
            filename="solve"
            language="python"
            code={`def solve(regions, empty_cells):`}
          />
        </div>

        {/* TODO: add image - Draw the recursion tree showing successful branches and backtracking
        <div>
          <img src="" alt="Recursion tree showing successful branches and backtracking" style={{ width: 'auto', height: 'auto' }} />
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Recursion Tree
          </p>
        </div> */}

        <hr className='border-gray-300' />
        <H1 text="One Last Realization" />
        <hr className='border-gray-300' />

        <p>
          Remember <code>empty_cells</code>?
        </p>

        <p>
          The list I created near the beginning because I thought I'd need it to detect when the puzzle was solved?
        </p>

        <p>
          Turns out...
        </p>

        <p>
          I never actually used it.
        </p>

        <p>
          Originally my base case was going to be:
        </p>

        <div className="overflow-x-auto">
          <CodeBlock
            filename="original_base"
            language="python"
            code={`len(empty_cells) == 0`}
          />
        </div>

        <p>
          But while finishing the recursion I noticed something.
        </p>

        <p>
          Every time I successfully place a queen, that region is removed from the <code>regions</code> dictionary.
        </p>

        <p>
          That means an empty <code>regions</code> dictionary already tells me exactly the same thing.
        </p>

        <div className="overflow-x-auto">
          <CodeBlock
            filename="actual_base"
            language="python"
            code={`if not regions:`}
          />
        </div>

        <p>
          Every region has been assigned a queen.
        </p>

        <p>
          Puzzle solved.
        </p>

        <p>
          So <code>empty_cells</code> quietly became unnecessary.
        </p>

        <p>
          I left it in for a while before finally removing it.
        </p>

        <p>
          It was one of those variables that seemed important at the beginning but slowly became irrelevant as the algorithm evolved.
        </p>

        <hr className='border-gray-300' />
        <H1 text="Final Algorithm" />
        <hr className='border-gray-300' />

        <p>
          The final idea ended up being surprisingly simple.
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>Represent the board as a 2D array.</li>
          <li>Store every coloured region in a dictionary.</li>
          <li>Always solve the smallest remaining region first.</li>
          <li>After placing a queen, prune every blocked cell.</li>
          <li>If pruning invalidates a region, backtrack.</li>
          <li>Repeat until no regions remain.</li>
        </ul>

        <hr className='border-gray-300' />
        <H1 text="Looking Back" />
        <hr className='border-gray-300' />

        <p>
          I'm sure there are cleaner ways to solve this puzzle.
        </p>

        <p>
          There are probably smarter heuristics, better representations, and more efficient pruning strategies.
        </p>

        <p>
          But that's never really been the goal of Random Algo.
        </p>

        <p>
          The goal isn't to present the perfect solution.
        </p>

        <p>
          It's to document how I arrived at <em>my</em> solution.
        </p>

        <p>
          The little observations.
        </p>

        <p>
          The dead ends.
        </p>

        <p>
          The bugs.
        </p>

        <p>
          The moments where something suddenly clicked.
        </p>

        <p>
          This solver started the same way Tango Algo did.
        </p>

        <p>
          With a completely random thought.
        </p>

        <blockquote className="border-l-2 border-white pl-3 md:pl-4 italic text-gray-300 text-sm md:text-base">
          "I wonder if I can write an algorithm for this?"
        </blockquote>

        <p>
          A few hours later, that random thought had turned into another working algorithm.
        </p>

        <p>
          And honestly, that's my favourite part.
        </p>
        <hr className='border-gray-300' />
        <H1 text="Resources" />
        <hr className='border-gray-300' />

        <p>Below are resources related to this write-up and solver:</p>

        <ul className="list-disc pl-5 space-y-2">
          <li><a href="https://github.com/vishesh-sachan/RandomAlgos/blob/main/src/originals/queens/queens.py" target="_blank" rel="noopener noreferrer">Complete code file: Queens.py</a></li>
          <li><a href="https://drive.google.com/file/d/1GqQ4lw9uC-rHXoH7t6vDyNhLRlK_KdVM/view?usp=sharing" target="_blank" rel="noopener noreferrer">Original sketches and planning: notes and drafts used while designing the solver</a></li>
          <li><a href="https://github.com/vishesh-sachan/RandomAlgos/blob/main/src/originals/queens/queens-blog-first-draft.md" target="_blank" rel="noopener noreferrer">Blog's First Draft</a></li>
        </ul>
      </div>

    </article>
  )
}

export default Queens
