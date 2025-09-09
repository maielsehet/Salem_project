<!DOCTYPE html>
<html>
<head>
    <title>Add Warehouse</title>
</head>
<body>
    <h1>Add New Warehouse</h1>

    @if ($errors->any())
        <div style="color: red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('warehouses.store') }}" method="POST">
        @csrf
        <label>Name:</label>
        <input type="text" name="name"><br><br>

        <label>Branch ID:</label>
        <input type="number" name="branch_id"><br><br>

        <label>Location:</label>
        <input type="text" name="location"><br><br>

        <button type="submit">Save</button>
    </form>

    <a href="{{ route('warehouses.index') }}">⬅ Back to list</a>
</body>
</html>
