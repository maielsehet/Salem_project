<!DOCTYPE html>
<html>
<head>
    <title>Branches</title>
</head>
<body>
    <h1>Branches List</h1>
    <a href="{{ route('branches.create') }}">+ Add Branch</a>
    <ul>
        @foreach($branches as $branch)
            <li>
                {{ $branch->name }} - {{ $branch->location }}
                <a href="{{ route('branches.edit', $branch->id) }}">Edit</a>
                <form action="{{ route('branches.destroy', $branch->id) }}" method="POST" style="display:inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit">Delete</button>
                </form>
            </li>
        @endforeach
    </ul>
    <ul>
        @foreach ($branches as $branch)
    <p>{{ $branch->name }}</p>
    <a href="{{ route('branches.edit', $branch->id) }}">تعديل</a>

    <form action="{{ route('branches.destroy', $branch->id) }}" method="POST">
        @csrf
        @method('DELETE')
        <button type="submit">مسح</button>
    </form>
@endforeach
    </ul>
</body>
</html>
