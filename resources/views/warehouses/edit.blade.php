<!DOCTYPE html>
<html>
<head>
    <title>Edit Warehouse</title>
</head>
<body>
    <h1>Edit Warehouse</h1>

    @if ($errors->any())
        <div style="color: red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('warehouses.update', $warehouse->id) }}" method="POST">
        @csrf
        @method('PUT')

        <label>Name:</label>
        <input type="text" name="name" value="{{ $warehouse->name }}"><br><br>

        <label>Branch ID:</label>
        <input type="number" name="branch_id" value="{{ $warehouse->branch_id }}"><br><br>

        <label>Location:</label>
        <input type="text" name="location" value="{{ $warehouse->location }}"><br><br>

        <button type="submit">Update</button>
    </form>

    <a href="{{ route('warehouses.index') }}">⬅ Back to list</a>
</body>
</html>
