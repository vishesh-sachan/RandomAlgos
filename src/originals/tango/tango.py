board = [
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None],
    [None, None, None, None, None, None]
]

empty_cells = [(0,0), (0,1), (0,2), (0,3), (0,4), (0,5),
               (1,0), (1,1), (1,2), (1,3), (1,4), (1,5),
               (2,0), (2,1), (2,2), (2,3), (2,4), (2,5),
               (3,0), (3,1), (3,2), (3,3), (3,4), (3,5),
               (4,0), (4,1), (4,2), (4,3), (4,4), (4,5),
               (5,0), (5,1), (5,2), (5,3), (5,4), (5,5)]

# comes from input
# required format: {(r, c): val, ...}

filled_cells = {}

def place_filled_cells():
    for key in filled_cells.keys():
        r, c = key
        val = filled_cells[key]
        board[r][c] = val

place_filled_cells()

# removing filled cells from empty cells

empty_cells = sorted(set(empty_cells) - set(filled_cells.keys()))

# print("Empty cells:", empty_cells)

# constraints come from input
# format for "=" constraints: [((r1, c1), (r2, c2)),...], meaning (r1, c1) == (r2, c2)

equal_constraints = []

cross_constraints = []

# for counting 0s and 1s in rows and columns
row0 = [0,0,0,0,0,0]
row1 = [0,0,0,0,0,0]
column0 = [0,0,0,0,0,0]
column1 = [0,0,0,0,0,0]

# initialize counts from pre-filled cells
def initialize_counts():
    for (r, c), val in filled_cells.items():
        if val == 0:
            row0[r] += 1
            column0[c] += 1
        else:
            row1[r] += 1
            column1[c] += 1


def update_counts(r, c, val, delta):
    if val == 0:
        row0[r] += delta
        column0[c] += delta
    else:
        row1[r] += delta
        column1[c] += delta


initialize_counts()


# validating that placing val in (r, c) does not exceed the limit of 3 for that row and column
def validate_counts(r, c, val):
    if val == 0:
        if row0[r] >= 3 or column0[c] >= 3:
            return False
    else:        
        if row1[r] >= 3 or column1[c] >= 3:
            return False
    return True

# TRIPLE CHECKS

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

# SPECIAL CONSTRAINT CHECKS

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

# MAIN VALIDATION

def is_valid(r, c, val):

    if not validate_counts(r, c, val):
        return False

    if not check_three_consecutive(r, c, val):
        return False

    if not check_constraints(r, c, val):
        return False

    return True

# tracking stack
stack = []

# Recursive solver with backtracking

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
            stack.append((r, c, val))

            # recurse
            if solve(index + 1):
                return True

            # backtrack
            board[r][c] = None
            update_counts(r, c, val, -1)
            stack.append((r, c, None))
            
    return False


# PRINT BOARD

def print_board():

    for row in board:
        print(row)

if solve(0):
    print("Solved:\n")
    print_board()
else:
    print("No solution found")