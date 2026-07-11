board = [
    [None for _ in range(7)]
    for _ in range(7)
]

regions = {
    "purple": [
        (0,0), (1,0), (2,0), (3,0)
    ],

    "orange": [
        (0,1), (1,1), (2,1), (3,1),
        (4,0), (4,1)
    ],

    "green": [
        (1,2), (2,2), (3,2), (4,2)
    ],

    "red": [
        (3,3)
    ],

    "gray": [
        (2,5), (2,6)
    ],

    "yellow": [
        (5,4), (5,5),
        (6,4), (6,5), (6,6)
    ],

    # Everything else is the large blue region
    "blue": [
        (0,2), (0,3), (0,4), (0,5), (0,6),
        (1,3), (1,4), (1,5), (1,6),
        (2,3), (2,4),
        (3,4), (3,5), (3,6),
        (4,3), (4,4), (4,5), (4,6),
        (5,0), (5,1), (5,2), (5,3), (5,6),
        (6,0), (6,1), (6,2), (6,3)
    ]
}


def prune_cells(cell, regions):
    row, col = cell

    def is_blocked(candidate):
        r, c = candidate
        return (
            r == row or
            c == col or
            (abs(r - row) <= 1 and abs(c - col) <= 1)
        )

    new_regions = {}

    for region_name, region_cells in regions.items():

        # This region already has its queen
        if cell in region_cells:
            continue

        remaining = [
            candidate
            for candidate in region_cells
            if not is_blocked(candidate)
        ]

        # Region has no legal cells left
        if not remaining:
            return False

        new_regions[region_name] = remaining

    return new_regions


solution = []


def solve(regions):

    # Every region has been assigned a queen
    if not regions:
        return True

    # Pick region with fewest choices
    region_name = min(regions, key=lambda r: len(regions[r]))

    for cell in regions[region_name]:

        solution.append(cell)

        new_regions = prune_cells(cell, regions)

        if new_regions is not False:
            if solve(new_regions):
                return True

        # Backtrack
        solution.pop()

    return False


if solve(regions):

    for r, c in solution:
        board[r][c] = "Q"

    print("Solution:\n")

    for row in board:
        print(" ".join("Q" if cell == "Q" else "." for cell in row))

    print("\nQueen Positions:")
    print(solution)

else:
    print("No solution found.")