<!DOCTYPE html>
<html>
<head>
    <title>Edit Branch</title>
</head>
<body>
    <h1>Edit Branch</h1>
    <form action="{{ route('branches.update', $branch->id) }}" method="POST">
        @csrf
        @method('PUT')
        <input type="text" name="name" value="{{ $branch->name }}" required>
        <input type="text" name="location" value="{{ $branch->location }}">
        <input type="text" name="phone" value="{{ $branch->phone }}">
        <button type="submit">Update</button>
    </form>
</body>
</html>
