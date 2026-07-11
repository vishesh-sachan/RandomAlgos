## understanding the game

it’s 7x7 grid 

board is divided into regions by colours 

the goal is to assign each region a queen without voilating the following rules 

- exactly one queen in row, column and colour region
- 2 queens can never be neighbours neither adjacent nor diagonal

## Representation

board 7x7 grid → 2D array

for region i am thinking about dictionary 
where key is colour and value is array of tuple (cell coordinates)

```
{
	'red' : [(1,2),(3,4)],
	'blue' : [(4,5),(5,6)],
}
```

we also need a to track how many cells are yet to be filled so we track that by

```
empty_cells = [(r,c),]
```

now with this representation how we start filling cells 

think about it like the the smaller the region the smaller the possible places for queens to be i.e less iteration and one smaller region have queen removing the cells that are blocked other region gets small as well

so i am picking the smaller region first, assign queen to one of its cell then remove all the cell that are blocked
(blocked → means because of the queen we just placed which cells can not have queens i.e there can not be queen in that row , column or in neighbouring cells so those cells are blocked )

at this point i was considering the representation again as for removing blocked cells from empty_cells is easy but in region could be tricky and removing them from 2 places was something i was considering 

then after sometime i could’t come up with anything so moved forward with the same representation  

so to prune the regions and empty cells 
we need a function that given a cell we want it to remove all the blocked cells considering we place a queen in that cell

and it returns a new copy of updated region and empty_cells 

```
prue(cell)
```

now i thought we can start on solve function (recursive one)

pick smallest region - assign queen 
call prune cells 
repeat until no empty cells are left 

but then realized a flaw in prune function what happen when if a region blocked and removed without having a queen

consider this a queen is assigned R1 which inturn blocks some of the cells of R2 ,
then we assign a Queen to R3 which also block some cells of R2 and so on and evnentually R2 is completely blocked and that region was never assigned a queen it highly unlikly but covering edge cases is right

so to make sure that no region is ignored we add a condition that check if the current cell belogs to a region then that region can be removed and if not and region is still completly ending then stop and go back choose different  cell as current solution is not right.

after this is i started working on solve function 
base case - when all cells are filled or blocked i.e len(empty_cells) = 0

then choose smallest region 

pick one cell and then prune with that cell if pruning fails choose other cell 

otherwise call solve again with smaller problem / region selection 

during this i realised that prune function is flawed it only takes cell and prune the copy of original variables again and again which means it does prune board for cell but does so for a completly new board 
so we need to pass the copy of new smaller regions after each pruning 

```
def prune_cells(cell, empty_cells, regions):
```

now we complete the solve function 

after completing all this i noticed that i haven’t used empty_cells any where originally i initialised it to be used in base case but i saw i can use regions as base case since once the region has assigned queens they are removed from region i.e regions empty means board complete problem solved