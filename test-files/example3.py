# Example Python file for testing the Boolean Search extension

# Test 1: Function definitions (search: "def AND return")
def calculate_average(numbers):
    """Calculate the average of a list of numbers."""
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)


# Test 2: Class definitions (search: "class AND :")
class DataProcessor:
    """A class for processing data."""
    
    def __init__(self, data):
        self.data = data
        self.processed = False
    
    def process(self):
        """Process the data."""
        self.processed = True
        return self.transform_data()
    
    def transform_data(self):
        """Transform the data."""
        return [item.upper() for item in self.data]


# Test 3: Error handling (search: "except OR raise")
def safe_divide(a, b):
    """Safely divide two numbers."""
    try:
        result = a / b
    except ZeroDivisionError:
        print("Error: Division by zero")
        return None
    except TypeError:
        raise ValueError("Invalid types for division")
    return result


# Test 4: Import statements (search: "import AND from")
from typing import List, Dict, Optional
from datetime import datetime


# Test 5: Decorators (search: "@" and "def")
def timing_decorator(func):
    """A decorator that times function execution."""
    def wrapper(*args, **kwargs):
        start = datetime.now()
        result = func(*args, **kwargs)
        end = datetime.now()
        print(f"Execution time: {end - start}")
        return result
    return wrapper


@timing_decorator
def slow_function():
    """A slow function for testing."""
    import time
    time.sleep(1)
    return "Done"


# Test 6: List comprehensions (search: "for AND in")
def filter_positive_numbers(numbers):
    """Filter positive numbers from a list."""
    return [num for num in numbers if num > 0]


# Test 7: Lambda functions (search: "lambda AND :")
squared = lambda x: x ** 2
is_even = lambda x: x % 2 == 0


# Test 8: Async functions (search: "async AND def")
async def fetch_data(url):
    """Asynchronously fetch data from a URL."""
    # Simulate async operation
    await asyncio.sleep(1)
    return {"status": "success"}


# Test 9: Type hints (search: "def AND ->")
def get_user_name(user_id: int) -> str:
    """Get a user's name by ID."""
    return f"User{user_id}"


# Test 10: Comments (search: "TODO OR FIXME")
# TODO: Add error handling for network failures
# FIXME: Memory leak in data processing
# NOTE: This needs optimization

if __name__ == "__main__":
    print("Testing Boolean Search extension")
    print(calculate_average([1, 2, 3, 4, 5]))

