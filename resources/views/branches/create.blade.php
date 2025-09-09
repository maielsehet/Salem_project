<!DOCTYPE html>
<html>
<head>
    <title>Add Branch</title>
</head>
<body>
    <h1>Add Branch</h1>
    <form action="{{ route('branches.store') }}" method="POST">
        @csrf
        <input type="text" name="name" placeholder="Branch Name" required>
        <input type="text" name="location" placeholder="Location">
        <input type="text" name="phone" placeholder="Phone">
        <button type="submit">Save</button>
    </form>
</body>
</html>
