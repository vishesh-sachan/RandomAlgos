# Tango Algo

You all must have played LinkedIn game named Tango in which you have to fill the board with sun or moon but there are coditions.
so one day i was playing Tango when i thought hmm can i write a program that can solve it, algorithm more precicly so i did.

in this we will build tango solver step by step

### Tango
it is a 6x6 board game which has
1. some already filled cells
2. constrains which represents relation between 2 cell 
3. Rules to fill the empy cells
    - Each row and column must contain the same number of sun and moon in our 6x6 board, 3 suns and 3 moons
    - No more tha 2 sun or moon may be next to each other either vertically or horizontally
    - Cells seperated by an = sign must be of the same type
    - Cells seperated by an X sign must be of the opposite type

## Solution

### Board Representation
before we even thing how to solve it we must first decribe how to explain what the board state is to the computer
why it is important to do first because how we represent board and its constraints will determine the rest of the algo

when we think about representing a 6x6 grid i think about arrays but 1D array will not saffice so 2D array 
#### Image of board

thats about the board now we need to think about how we represent already filled cells that cant be changed 
well to represent a cell on the board we need 2 index we could store them in an array or tuple 
here tuple would make sense as it has unpacking ability on array to acess each index we would need to travers increasing time complexity

now when we know how to reperesent cells now we need a way to store value i.e, what is on that cell sun or moon 
-- a quick note for our convinience we will assume sun as 0 and moon as 1 --
then we have tuple and a value to store that will represent filled cells
we can store them in a dictonari cell index as key and value as value
```
filled_cells = {(0,0):0,(2,1):1,....}
```
#### Image of board

till now we have represented our board and filled cells we move on to special constraints
which for us are equal cells and cross (oppossite) cells
to reoresent the relation we need to store 2 cell address which was represented by a tuple so to reperesent a relation we need 2 tuples stored together they could be in array the again array is more time complex to read so tuple

```
equal_cells = [((0,0),(0,1)),((3,4),(4,4)),...]
```
#### Image of board

same for the opposite cells

### Validation

to fill cell we need to check for each cell what value is valid to put there
for which we will check all conditions

1. each row must contain the same number of 0 and 1
how we can check what no. of 0 or 1 are in row or column to know it we must track no. of zeros and ones 
for which i am thinking of 4 arrays 2 for rows and colums each rpresnting 0 and 1
```
row0 = [0,0,0,0,0,0]
row1 = [0,0,0,0,0,0]
column0 = [0,0,0,0,0,0]
column1 = [0,0,0,0,0,0]
```
and to reperesent count of 0 and 1 and index of array will reperesent row or column of board i.e row0[0] will represent count of all the 0 in 0th row of board
#### Image of board

now to fill all these row and colum count according to filled cells we will need a function 
initialize_counts() -> it will traverse all the values in filled_cells dict and for each row and column add 1 to its corresponding count

```
def initialize_counts():
    for (r, c), val in filled_cells.items():
        if val == 0:
            row0[r] += 1
            column0[c] += 1
        else:
            row1[r] += 1
            column1[c] += 1
```

now that's when we have sum we can move to a validation function that will take cell and value and return true if that value can be inserted in that cell

we'll call it validate_rows_and_columns_count(r, c, val) // i know verbose but it helps in understanding
it will check the concerned rows and columns count for that val if it's count equal to 3 or greater the return false 
here we are checking for 3 sun and moon not for equals because we know the grid is always going to be 6x6 so equal means 3 3 of both

```
def validate_rows_and_columns_count(r, c, val):
    if val == 0:
        if row0[r] >= 3 or column0[c] >= 3:
            return False
    else:        
        if row1[r] >= 3 or column1[c] >= 3:
            return False
    return True
```
so rows and column is done

2. No more than 2 sun or moon may be next to each other vertically or horizontaly
i.e 00✅ , 000❌
<!-- img -->
to check three consecutive values what we can do hugh
we can assume that the value we are trying to place we place it then we create string with 3 consecutive values including the one we just placed 
<!-- img of pair of values -->
as you can see in the imgae we can tell we have 6 possible strings or combination in which we can get 3 consecutive values considering that cell we are placeing is in the middle 
now what about the boundary condition what if we are close to or at the boundary then we will not have the 6 possiblities so how do we do that 
6 pairs are : here X represent the value that we are placeing
val val X -> hori left pair
val X val -> hori mid
X val val -> hori right
same on verticle 
<!-- img of each pair labeled  -->
what we can do is will creating the strings we can check wheather the cell we are accessing exist on the board 

but it will be lengthy and tedious what i observed while looking on the grid 
what if we check where are we stainding first and based on that check the pattern

for example if we are at the 1,1 the there we know we will not have 2 values on to our left or that side pair does not exist 

```
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

3. Cells seperated by an = sign must be of the same type And Cells seperated by an X sign must be of the opposite type

for this we already have all constrains in an array of tuple in side tuple 
all we need to do is for a given cell traverse the equal and cross constraint array find if that cell have any constraints if yes then check wheather the other paired cell have eqaul or cross val to what we are putting and based on the constraint and val we return true or false
we will call this function -> check_constraints(r, c, val):

now we know the first part which is for loop
```
for (a,b) in equal_constraints
<!-- here a nd b are 2 cells with relation, where a and b them selfs are tuple of cell index -->
```
now we need to check if our cell is equal to a or b if equal to a then we check if b have any value on the board if not then return true 
if b has vaule then for equal constrain check if it is equal to our val if yess then return ture else false 

if a is not the cell we are placing val in we check b and do same for b
```
for (a, b) in equal_constraints:

        if (r, c) == a:
            rr, cc = b

            if board[rr][cc] is not None:
                if board[rr][cc] != val:
                    return False

        elif (r, c) == b:
            rr, cc = a

            if board[rr][cc] is not None:
                if board[rr][cc] != val:
                    return False
retun True
```

we do same fro cross constraints but we check if value is oppostite then true else false
```
for (a, b) in cross_constraints:

        if (r, c) == a:
            rr, cc = b

            if board[rr][cc] is not None:
                if board[rr][cc] == val:
                    return False

        elif (r, c) == b:
            rr, cc = a

            if board[rr][cc] is not None:
                if board[rr][cc] == val:
                    return False

return True
```

so the complete function for this would become
```
def check_constraints(r, c, val):

    # "=" constraints
    for (a, b) in equal_constraints:

        if (r, c) == a:
            rr, cc = b

            if board[rr][cc] is not None:
                if board[rr][cc] != val:
                    return False

        elif (r, c) == b:
            rr, cc = a

            if board[rr][cc] is not None:
                if board[rr][cc] != val:
                    return False

    # "x" constraints
    for (a, b) in cross_constraints:

        if (r, c) == a:
            rr, cc = b

            if board[rr][cc] is not None:
                if board[rr][cc] == val:
                    return False

        elif (r, c) == b:
            rr, cc = a

            if board[rr][cc] is not None:
                if board[rr][cc] == val:
                    return False

    return True
```

now that we have tacked all individual rules we need a main validation function that will run all validation functions

```
def is_valid(r, c, val):

    if not validate_rows_and_columns_count(r, c, val):
        return False

    if not check_three_consecutive(r, c, val):
        return False

    if not check_constraints(r, c, val):
        return False

    return True
```

### Solve
at last comes the most important and complex function 
solve function which will iterate over all the cells in board and fill it with correct value at a time while validating at each step 

how can we do that
we could simplly loop over the board like we do in 2d array and fill one of the 2 values 0 or 1  but there is a problem which is that what happens when we can put none of the value at the cell it will get stuck 
to solve that we need some kind of bactracking to change our previous choices 

for which we can use recurtion which in it self can create a desision tree and whenever stuck go back and choose another value 
<!-- img of desision tree-->

so to write a recursive function we need a base condition that will stop our function to run infinitly

what can be a base condition well we want to stop once all the cells have been filled i.e board complete
how do we know when the board is complete would we will be travering complete board again and again to check for empty cell or or we can track all the empty cells

```
empty_cells = [] // initiallized with all the cells of the bard and then substracting the filled cells
for empy cells we dont need value because it will be None meaing as simple array of tuple

empty_cells = sorted(empty_cells - filled_cells.keys())
```

now that we have empty cells solve function doesnot need to traverse board it can simply traverse empty_cells and once it reached the end of it we can say all the empty cells are filled and board if complete
```
solve(index)
here to get row and column of empty cell we do
r,c = empty_cell[index] // tuple unpacking the reason we did't used array
```

this means our base condition becomes 
```
if index == len(empty_cells):
    return True
```

now the we know that we have 2 values to put 0 or 1 so what we do is we pick one value and check whether the value is valid to put in that cell 
```
is_valid(r,c,val)
```

if valid then we place that value and also update the row and column count so that it does not have stale data
to do so we use helper function to update counts i dont think i need to explain this its preet self explanatory
```
def update_counts(r, c, val, delta):
    if val == 0:
        row0[r] += delta
        column0[c] += delta
    else:
        row1[r] += delta
        column1[c] += delta
```

now after placing value nand updating count we all the solve funtion againg with next index and put it in a if condition and if it fails we change our previous choice

<!-- img or animationof backtracing -->
and if even when al the possibiities are explored and we don't find the ans we can se the no solutionexist whixh will happen when wrong constraints and constants are feeded tothe algo

```
def solve(index):

    # board completed
    if index == len(empty_cells):
        return True

    r, c = empty_cells[index]

    for val in [0, 1]:

        if is_valid(r, c, val):

            # place value
            board[r][c] = val
            update_counts(r, c, val, 1)

            # recurse
            if solve(index + 1):
                return True

            # backtrack
            board[r][c] = None
            update_counts(r, c, val, -1)
            
    return False
```

now some other funtions and intializations that we did 
```
board = [
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
]

empty_cells = [(0,0), (0,1), (0,2), (0,3), (0,4), (0,5),
               (1,0), (1,1), (1,2), (1,3), (1,4), (1,5),
               (2,0), (2,1), (2,2), (2,3), (2,4), (2,5),
               (3,0), (3,1), (3,2), (3,3), (3,4), (3,5),
               (4,0), (4,1), (4,2), (4,3), (4,4), (4,5),
               (5,0), (5,1), (5,2), (5,3), (5,4), (5,5)]

<!-- function to fill the board once we haev the filled_cells -->

def place_filled_cells():
    for key in filled_cells.keys():
        r, c = key
        val = filled_cells[key]
        board[r][c] = val

def print_board():

    for row in board:
        print(row)

<!-- main calling of solve funtion  -->

if solve(0):
    print("Solved:\n")
    print_board()
else:
    print("No solution found")
```

### Summary
